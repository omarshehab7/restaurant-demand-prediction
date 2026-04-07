"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

interface AuthFormProps {
  defaultMode?: Mode;
}

export function AuthForm({ defaultMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Authentication is not configured. Please set up Supabase environment variables.");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm, then sign in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
          style={{ background: "oklch(0.75 0.18 55 / 40%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 animate-float"
          style={{ background: "oklch(0.65 0.15 160 / 40%)", filter: "blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">
              Rush<span className="gradient-text">Radar</span>
            </span>
          </Link>
        </div>

        <Card className="rounded-2xl border-border/50 shadow-2xl shadow-black/10">
          <CardContent className="p-8">
            {/* Tab switcher */}
            <div className="flex rounded-xl bg-muted/60 p-1 mb-8">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === m
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 10 : -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-heading text-2xl font-bold mb-1">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {mode === "login"
                    ? "Sign in to access your restaurant data."
                    : "Start predicting demand for your restaurant."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@restaurant.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                        required
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error / Success */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-2.5 bg-destructive/10 text-destructive rounded-xl p-3 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl p-3 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl h-11 font-semibold gradient-brand text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {mode === "login" ? "Signing in…" : "Creating account…"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* Demo shortcut */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">Just exploring?</p>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground">
                  Continue with Demo Data →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
