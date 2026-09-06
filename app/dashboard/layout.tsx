import Link from "next/link";
import { BookOpen, LogOut } from "lucide-react";
import { logoutAction } from "../(auth)/actions";

const NAV = [{ href: "/dashboard/courses", label: "Cours", icon: BookOpen }];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border-light bg-surface px-4 py-6">
        <span className="mb-8 px-2 font-display text-xl font-extrabold text-primary">fhemt admin</span>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
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
