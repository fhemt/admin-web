import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { getAnalyticsOverview } from "@/lib/api/analytics";
import { SessionExpiredError } from "@/lib/api/errors";
import {
  ACADEMIC_LEVEL_LABEL,
  BarList,
  FunnelBar,
  RevenueTrendChart,
  SectionHeader,
  SignupsTrendChart,
  StatCard,
  toBarListFromCountByLabel,
} from "./charts";

export const metadata: Metadata = { title: "Analytics" };

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export default async function AnalyticsPage() {
  let overview;
  try {
    await getMe();
    overview = await getAnalyticsOverview();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const { revenue, userGrowth, engagement, affiliates } = overview;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-foreground-secondary">Vue d’ensemble des revenus, de la croissance et de l’engagement.</p>
      </div>

      <section>
        <SectionHeader title="Revenus" subtitle="Basé sur les demandes premium approuvées" />
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Revenu total" value={`${revenue.totalApprovedRevenue} MAD`} />
          <StatCard label="En attente" value={String(revenue.pendingCount)} />
          <StatCard label="Approuvées" value={String(revenue.approvedCount)} />
          <StatCard label="Refusées" value={String(revenue.rejectedCount)} />
          <StatCard label="Prix moyen" value={`${Math.round(revenue.averagePricePaid)} MAD`} />
          <StatCard label="Avec code promo" value={String(revenue.promoRedemptionsCount)} />
          <StatCard label="Prix plein" value={String(revenue.fullPriceCount)} />
        </div>
        <div className="rounded-2xl border border-border-light bg-surface p-4">
          <div className="mb-2 text-xs text-foreground-tertiary">Revenu approuvé — 30 derniers jours</div>
          <RevenueTrendChart points={revenue.last30Days} />
        </div>
      </section>

      <section>
        <SectionHeader title="Élèves" subtitle="Croissance et conversion vers premium" />
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatCard label="Élèves" value={String(userGrowth.totalStudents)} />
          <StatCard label="Premium" value={String(userGrowth.totalPremium)} />
          <StatCard label="Suspendus" value={String(userGrowth.totalSuspended)} />
        </div>
        <div className="mb-4 rounded-2xl border border-border-light bg-surface p-4">
          <div className="mb-2 text-xs text-foreground-tertiary">Inscriptions — 30 derniers jours</div>
          <SignupsTrendChart points={userGrowth.signupsLast30Days} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-light bg-surface p-4">
            <div className="mb-3 text-xs text-foreground-tertiary">Entonnoir premium</div>
            <div className="flex flex-col gap-3">
              <FunnelBar label="Inscrits" value={userGrowth.funnelSignedUp} of={userGrowth.funnelSignedUp} percentOfTotal={100} />
              <FunnelBar
                label="Ont soumis une demande"
                value={userGrowth.funnelSubmittedPremiumRequest}
                of={userGrowth.funnelSignedUp}
                percentOfTotal={
                  userGrowth.funnelSignedUp === 0
                    ? 0
                    : Math.round((userGrowth.funnelSubmittedPremiumRequest / userGrowth.funnelSignedUp) * 100)
                }
              />
              <FunnelBar
                label="Ont été approuvés"
                value={userGrowth.funnelApprovedPremium}
                of={userGrowth.funnelSignedUp}
                percentOfTotal={
                  userGrowth.funnelSignedUp === 0 ? 0 : Math.round((userGrowth.funnelApprovedPremium / userGrowth.funnelSignedUp) * 100)
                }
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface p-4">
            <div className="mb-3 text-xs text-foreground-tertiary">Par niveau</div>
            <BarList items={toBarListFromCountByLabel(userGrowth.byAcademicLevel, ACADEMIC_LEVEL_LABEL)} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Engagement" subtitle="Cours et leçons" />
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatCard label="Inscriptions" value={String(engagement.totalEnrollments)} />
          <StatCard label="Taux de complétion" value={pct(engagement.completionRate)} />
          <StatCard label="Taux de réussite aux quiz" value={pct(engagement.quizPassRate)} />
        </div>
        <div className="rounded-2xl border border-border-light bg-surface p-4">
          <div className="mb-3 text-xs text-foreground-tertiary">Cours les plus suivis</div>
          <BarList items={engagement.topCourses.map((c) => ({ label: c.courseTitle, value: c.enrollments }))} />
        </div>
      </section>

      <section>
        <SectionHeader title="Affiliés" subtitle="Voir la page Affiliés pour gérer les codes et les versements" />
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Codes actifs" value={String(affiliates.totalActiveCodes)} />
          <StatCard label="Gagné" value={`${affiliates.totalEarnedAllTime} MAD`} />
          <StatCard label="Versé" value={`${affiliates.totalPaidAllTime} MAD`} />
          <StatCard label="Dû" value={`${affiliates.totalOwedAllTime} MAD`} />
        </div>
        <div className="rounded-2xl border border-border-light bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs text-foreground-tertiary">Meilleurs affiliés</div>
            <Link href="/dashboard/affiliates" className="text-xs font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <BarList
            items={affiliates.topAffiliates.map((a) => ({ label: `${a.ownerName} (${a.code})`, value: a.earned }))}
            formatValue={(v) => `${v} MAD`}
          />
        </div>
      </section>
    </div>
  );
}
