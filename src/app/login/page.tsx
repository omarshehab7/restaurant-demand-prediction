import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — RushRadar",
  description: "Sign in to your RushRadar account to access demand predictions for your restaurant.",
};

export default function LoginPage() {
  return <AuthForm defaultMode="login" />;
}
