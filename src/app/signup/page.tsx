import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — RushRadar",
  description: "Create a free RushRadar account and start predicting restaurant demand with AI.",
};

export default function SignupPage() {
  return <AuthForm defaultMode="signup" />;
}
