import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getMe } from "@/lib/api/profile";
import { listAffiliateCodes } from "@/lib/api/affiliates";
import { SessionExpiredError } from "@/lib/api/errors";
import { AffiliatesTable } from "./AffiliatesTable";

export const metadata: Metadata = { title: "Affiliés" };

export default async function AffiliatesPage() {
  let me, codes;
  try {
    me = await getMe();
    if (me.role !== "ADMIN") redirect("/dashboard/courses");
    codes = await listAffiliateCodes();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const totalOwed = codes.reduce((sum, c) => sum + c.totalOwed, 0);
  const totalRedemptions = codes.reduce((sum, c) => sum + c.redemptionCount, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Affiliés</h1>
          <p className="text-sm text-foreground-secondary">
            {codes.length} code{codes.length !== 1 ? "s" : ""} · {totalRedemptions} vente{totalRedemptions !== 1 ? "s" : ""} · {totalOwed} MAD dus
          </p>
        </div>
        <Link
          href="/dashboard/affiliates/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
        >
          <Plus size={16} strokeWidth={2} />
          Nouveau code
        </Link>
      </div>

      <AffiliatesTable codes={codes} />
    </div>
  );
}
