import { FolderKanban } from "lucide-react";

const AuthShell = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl md:grid-cols-[0.85fr_1fr]">
          <div className="hidden bg-emerald-700 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 grid h-12 w-12 place-items-center rounded-lg bg-white/15">
                <FolderKanban />
              </div>
              <h1 className="max-w-sm text-4xl font-bold leading-tight">StudyFlow AI keeps student projects moving.</h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50">
                Organize deadlines, tasks, team accountability, and feedback history from one focused workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg bg-white/10 p-3">Projects</div>
              <div className="rounded-lg bg-white/10 p-3">Kanban</div>
              <div className="rounded-lg bg-white/10 p-3">Comments</div>
            </div>
          </div>
          <div className="p-6 text-slate-950 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold text-emerald-700">StudyFlow AI</p>
              <h2 className="mt-2 text-3xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
