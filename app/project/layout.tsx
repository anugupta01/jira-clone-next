import Link from "next/link";

/** Ported from the project shell (sidebar + topbar). Trimmed to essentials. */
export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-14 flex-shrink-0 bg-slate-800 text-white flex flex-col items-center py-4 gap-4">
        <div className="h-8 w-8 rounded bg-blue-500" title="Jira Clone" />
      </aside>
      <div className="flex-1">
        <header className="border-b px-6 py-3">
          <nav className="flex gap-4 text-sm">
            <Link href="/project/board" className="font-medium">Board</Link>
            <span className="text-slate-400">Settings</span>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
