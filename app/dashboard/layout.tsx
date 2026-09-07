import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ClipboardList, LogOut, Settings, User, Users, Wallet } from "lucide-react";
import { getMe } from "@/lib/api/profile";
import { SessionExpiredError } from "@/lib/api/errors";
import { logoutAction } from "../(auth)/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let me;
  try {
    me = await getMe();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const nav = [
    { href: "/dashboard/courses", label: "Cours", icon: BookOpen },
    { href: "/dashboard/mock-exams", label: "Examens blancs", icon: ClipboardList },
    { href: "/dashboard/team", label: "Équipe", icon: Users },
    { href: "/dashboard/payments", label: "Paiements", icon: Wallet },
    { href: "/dashboard/profile", label: "Profil", icon: User },
    ...(me.role === "ADMIN" ? [{ href: "/dashboard/maintenance", label: "Maintenance", icon: Settings }] : []),
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border-light bg-surface px-4 py-6">
        <span className="mb-8 px-2 font-display text-xl font-extrabold text-primary">fhemt admin</span>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground"
            >
              <item.icon size={17} strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mb-2 px-3 text-xs text-foreground-tertiary">
          {me.firstName} {me.lastName} · {me.role === "ADMIN" ? "Admin" : "Enseignant"}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground"
          >
            <LogOut size={17} strokeWidth={1.5} />
            Déconnexion
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background px-8 py-8">{children}</main>
    </div>
  );
}
