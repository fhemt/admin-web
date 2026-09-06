import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "../OtpForm";

export const metadata: Metadata = { title: "Vérification" };

export default async function VerifyOtpPage({ searchParams }: PageProps<"/verify-otp">) {
  const { email } = await searchParams;
  if (!email || typeof email !== "string") {
    redirect("/login");
  }

  return (
    <>
      <h1 className="mb-1 font-display text-xl font-bold text-foreground">Vérifie ton email</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        On a envoyé un code à 6 chiffres à <span className="font-medium text-foreground">{email}</span>.
      </p>
      <OtpForm email={email} />
    </>
  );
}
