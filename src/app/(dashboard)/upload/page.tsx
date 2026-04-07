"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileType, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import Papa from "papaparse";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "text/csv" && !selected.name.endsWith(".csv")) {
      setError("Please select a valid CSV file");
      return;
    }

    setFile(selected);

    // Preview first few rows
    Papa.parse(selected, {
      header: true,
      preview: 5,
      complete: (results) => {
        setPreview(results.data);
      },
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured. Please set environment variables.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setError(null);

    try {
      const { data: user } = await supabase.auth.getUser();
      // Require auth for real uploads, or proceed if allowed by RLS
      // For demo purposes, we will try to insert anyway if RLS is permissive
      const userId = user?.user?.id;

      setProgress(30);

      // 1. Upload to Supabase Storage (optional requirement for backup)
      const filename = `orders-${Date.now()}.csv`;
      const { error: storageError } = await supabase.storage
        .from("csv-uploads")
        .upload(filename, file);

      if (storageError) {
         console.warn("Storage upload failed, continuing with DB insert", storageError);
      }
      setProgress(50);

      // 2. Parse CSV
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const rows: any[] = results.data;
            if (rows.length === 0) throw new Error("CSV is empty");

            // Extract unique branches
            const branchIds = [...new Set(rows.map(r => r.branch_id).filter(Boolean))];

            // 3. Insert Branches
            for (const bId of branchIds) {
               await supabase.from("branches").upsert(
                 { id: String(bId), name: `Branch ${bId}`, user_id: userId },
                 { onConflict: "id" }
               );
            }
            setProgress(70);

            // 4. Transform and Insert Orders
            const ordersToInsert = rows.map((r) => ({
              timestamp: new Date(r.timestamp).toISOString(),
              branch_id: String(r.branch_id),
              revenue: Number(r.revenue) || 0,
              items: typeof r.items === "string" ? JSON.parse(r.items || "[]") : (r.items || []),
              user_id: userId,
            }));

            // Supabase bulk insert (max 1000 per request recommended, but we take it all for simple datasets)
            const { error: insertError } = await supabase
              .from("orders")
              .insert(ordersToInsert);

            if (insertError) throw insertError;

            setProgress(100);
            setSuccess(true);
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } catch (err: any) {
            setError(err.message || "Failed to process CSV file");
            setLoading(false);
          }
        },
        error: (err) => {
          setError(`File parsing error: ${err.message}`);
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl max-h-screen pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
           <h2 className="font-heading text-2xl font-bold mb-1">Upload Data</h2>
           <p className="text-muted-foreground">Import historical orders to train the prediction engine.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="rounded-2xl border-border/50 border-dashed border-2">
          <CardContent className="p-10 flex flex-col items-center justify-center min-h-[300px]">
            {!file ? (
              <>
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">Drag and drop your CSV</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                  Upload a CSV file containing historical order data. Required columns: timestamp, branch_id, revenue, items.
                </p>
                <div className="relative">
                   <Button variant="default" className="rounded-xl relative overflow-hidden">
                     Browse Files
                     <input
                       type="file"
                       accept=".csv"
                       onChange={handleFileChange}
                       className="absolute inset-0 opacity-0 cursor-pointer"
                     />
                   </Button>
                </div>
              </>
            ) : (
               <div className="w-full">
                 <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileType className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                    </div>
                    {success ? (
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 text-sm"><CheckCircle2 className="h-4 w-4 mr-1"/> Uploaded</Badge>
                    ) : (
                       <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={loading} className="text-muted-foreground">Change</Button>
                    )}
                 </div>

                 {!success && !loading && preview.length > 0 && (
                   <div className="mb-8">
                     <p className="text-sm font-medium mb-3">Data Preview (first 5 rows)</p>
                     <div className="overflow-x-auto rounded-xl border border-border">
                       <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b border-border text-left">
                            <tr>
                              {Object.keys(preview[0]).map(key => (
                                <th key={key} className="py-2 px-3 font-medium text-muted-foreground">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {preview.map((row, i) => (
                              <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                                {Object.values(row).map((val: any, j) => (
                                  <td key={j} className="py-2 px-3 font-mono text-[11px] truncate max-w-[150px]">
                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                       </table>
                     </div>
                   </div>
                 )}

                 {error && (
                   <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
                     <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                     <p>{error}</p>
                   </div>
                 )}

                 {loading && (
                   <div className="w-full mb-6">
                     <div className="flex justify-between text-sm mb-2 font-medium">
                       <span>Processing...</span>
                       <span>{progress}%</span>
                     </div>
                     <div className="h-2 bg-muted rounded-full overflow-hidden">
                       <motion.div
                         className="h-full bg-primary"
                         initial={{ width: 0 }}
                         animate={{ width: progress + "%" }}
                         transition={{ duration: 0.3 }}
                       />
                     </div>
                   </div>
                 )}

                 <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline" onClick={() => setFile(null)} disabled={loading} className="rounded-xl">Cancel</Button>
                    <Button variant="default" onClick={handleUpload} disabled={loading || success} className="rounded-xl flex gap-2">
                       {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><UploadCloud className="h-4 w-4" /></motion.div> : <TrendingUp className="h-4 w-4" />}
                       {loading ? 'Processing Data...' : success ? 'Database Updated!' : 'Upload and Train Model'}
                    </Button>
                 </div>
               </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
