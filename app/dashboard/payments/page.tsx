import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { listPremiumRequests } from "@/lib/api/premium";
import { SessionExpiredError } from "@/lib/api/errors";
import { ReviewActions } from "./ReviewActions";

export const metadata: Metadata = { title: "Paiements" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PaymentsPage() {
  let requests;
  try {
    await getMe();
    requests = await listPremiumRequests("PENDING");
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Paiements</h1>
        <p className="text-sm text-foreground-secondary">
          {requests.length} demande{requests.length !== 1 ? "s" : ""} en attente de vérification.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-light bg-surface px-5 py-10 text-center text-sm text-foreground-tertiary">
          Aucune demande en attente.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((request) => (
            <div key={request.id} className="overflow-hidden rounded-2xl border border-border-light bg-surface">
              <div className="flex gap-4 px-5 py-4">
                <a
                  href={`/api/premium-requests/${request.id}/proof`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- proxied through our own route handler, not next/image-optimizable */}
                  <img
                    src={`/api/premium-requests/${request.id}/proof`}
                    alt="Justificatif de paiement"
                    className="h-20 w-20 rounded-xl border border-border-light object-cover transition hover:opacity-80"
                  />
                </a>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {request.userFirstName} {request.userLastName}
                    </div>
                    <div className="text-xs text-foreground-tertiary">{request.userEmail}</div>
                    <div className="mt-1.5">
                      <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-medium text-foreground-secondary">
                        {request.userReferenceCode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-foreground">{request.pricePaid} MAD</div>
                    <div className="text-xs text-foreground-tertiary">{formatDate(request.submittedAt)}</div>
                  </div>
                </div>
              </div>

              {request.promoCode && (
                <div className="border-t border-border-light bg-surface-warm px-5 py-2 text-xs text-foreground-secondary">
                  Code promo : <span className="font-medium text-foreground">{request.promoCode}</span>
                </div>
              )}

              <div className="flex items-center justify-end border-t border-border-light px-5 py-3">
                <ReviewActions requestId={request.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
