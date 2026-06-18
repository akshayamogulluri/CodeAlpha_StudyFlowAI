import { CheckCircle2, Clock3, FolderKanban, ListTodo, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import StatCard from "../components/StatCard";
import { formatDate } from "../utils/date";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [projectsResponse, statsResponse] = await Promise.all([
      api.get("/projects", { params: { search } }),
      api.get("/projects/stats")
    ]);
    setProjects(projectsResponse.data);
    setStats(statsResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const saveProject = async (payload) => {
    if (modal?.project) {
      await api.put(`/projects/${modal.project._id}`, payload);
    } else {
      await api.post("/projects", payload);
    }
    setModal(null);
    await loadData();
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}" and all of its tasks?`)) return;
    await api.delete(`/projects/${project._id}`);
    await loadData();
  };

  const statCards = useMemo(
    () => [
      { label: "Total projects", value: stats.totalProjects, icon: FolderKanban, tone: "emerald" },
      { label: "Total tasks", value: stats.totalTasks, icon: ListTodo, tone: "sky" },
      { label: "Completed", value: stats.completedTasks, icon: CheckCircle2, tone: "emerald" },
      { label: "Pending", value: stats.pendingTasks, icon: Clock3, tone: "amber" }
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Track student project deadlines, task load, and team progress.</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="panel p-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects by title, description, or member"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="panel h-52 animate-pulse bg-white" />
          ))}
        </div>
      ) : projects.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project._id} className="panel flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/projects/${project._id}`} className="text-lg font-bold hover:text-emerald-700">
                    {project.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">Deadline {formatDate(project.deadline)}</p>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setModal({ type: "edit", project })}>
                    <Pencil size={16} />
                  </button>
                  <button className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" onClick={() => deleteProject(project)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 min-h-16 text-sm leading-6 text-slate-600">{project.description || "No description yet."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.members?.length ? (
                  project.members.map((member) => (
                    <span key={member} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {member}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Solo project</span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          message="Create your first project and StudyFlow AI will organize the board, tasks, comments, and deadlines."
          action={
            <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
              <Plus size={16} />
              Create project
            </button>
          }
        />
      )}

      {modal && (
        <Modal title={modal.project ? "Edit project" : "Create project"} onClose={() => setModal(null)}>
          <ProjectForm initialProject={modal.project} onSubmit={saveProject} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
