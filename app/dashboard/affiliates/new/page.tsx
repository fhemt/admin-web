import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { SessionExpiredError } from "@/lib/api/errors";
import { CreateAffiliateForm } from "../CreateAffiliateForm";

export const metadata: Metadata = { title: "Nouveau code affilié" };

export default async function NewAffiliateCodePage() {
  let me;
  try {
    me = await getMe();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  if (me.role !== "ADMIN") redirect("/dashboard/affiliates");

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Nouveau code affilié</h1>
        <p className="text-sm text-foreground-secondary">
          Le prix ci-dessous remplace le prix plein dès que ce code est utilisé — le calcul se fait côté serveur, jamais depuis l’app.
        </p>
      </div>
      <CreateAffiliateForm />
    </div>
  );
}
