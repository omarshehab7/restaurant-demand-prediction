"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Bell, Palette, Shield} from "lucide-react";

const settingsSections = [
  { title: "Profile", description: "Manage your account details and preferences", icon: User },
  { title: "Notifications", description: "Configure alert preferences and channels", icon: Bell },
  { title: "Appearance", description: "Theme, language, and display settings", icon: Palette },
  { title: "Security", description: "Password, 2FA, and access controls", icon: Shield },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account and application preferences
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
            General
          </Badge>
        </div>
      </motion.div>

      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-0">
          {settingsSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <div className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm">
                    {section.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span className="text-muted-foreground text-sm">→</span>
              </div>
              {i < settingsSections.length - 1 && <Separator />}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
