export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-warm px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl font-extrabold text-primary">fhemt</span>
          <p className="mt-1 text-sm text-foreground-tertiary">Portail admin</p>
        </div>
        <div className="rounded-2xl border border-border-light bg-surface p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
