import { ArrowLeft, CalendarDays, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import CommentsPanel from "../components/CommentsPanel";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { formatDate } from "../utils/date";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" }
];

const ProjectBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBoard = async () => {
    setLoading(true);
    const [{ data: projects }, { data: taskData }] = await Promise.all([
      api.get("/projects"),
      api.get("/tasks", { params: { projectId } })
    ]);
    setProject(projects.find((item) => item._id === projectId));
    setTasks(taskData);
    setLoading(false);
  };

  useEffect(() => {
    loadBoard();
  }, [projectId]);

  const groupedTasks = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  const saveTask = async (payload) => {
    if (modal?.task) {
      await api.put(`/tasks/${modal.task._id}`, payload);
    } else {
      await api.post("/tasks", { ...payload, projectId });
    }
    setModal(null);
    await loadBoard();
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await api.delete(`/tasks/${task._id}`);
    await loadBoard();
  };

  const moveTask = async (event, status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const task = tasks.find((item) => item._id === taskId);
    if (!task || task.status === status) return;

    setTasks((current) => current.map((item) => (item._id === taskId ? { ...item, status } : item)));
    await api.put(`/tasks/${taskId}`, { status });
  };

  if (loading) {
    return <div className="panel h-96 animate-pulse" />;
  }

  if (!project) {
    return <EmptyState title="Project not found" message="This project may have been deleted or is no longer shared with you." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <Link to="/" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              Deadline {formatDate(project.deadline)}
            </span>
            <span>{project.members?.length || 0} team members</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <section
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => moveTask(event, column.id)}
            className="min-h-96 rounded-lg border border-slate-200 bg-slate-100/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="font-bold">{column.title}</h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500">{groupedTasks[column.id].length}</span>
            </div>
            <div className="space-y-3">
              {groupedTasks[column.id].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(selectedTask) => setModal({ type: "edit", task: selectedTask })}
                  onDelete={deleteTask}
                  onOpenComments={(selectedTask) => setModal({ type: "comments", task: selectedTask })}
                />
              ))}
              {!groupedTasks[column.id].length && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500">
                  Drop tasks here
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {modal?.type !== "comments" && modal && (
        <Modal title={modal.task ? "Edit task" : "Create task"} onClose={() => setModal(null)}>
          <TaskForm project={project} initialTask={modal.task} onSubmit={saveTask} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === "comments" && (
        <Modal title={modal.task.title} onClose={() => setModal(null)}>
          <p className="text-sm leading-6 text-slate-600">{modal.task.description || "No task description."}</p>
          <CommentsPanel task={modal.task} />
        </Modal>
      )}
    </div>
  );
};

export default ProjectBoard;
