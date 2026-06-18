import { CalendarDays, MessageSquare, Pencil, Trash2, UserRound } from "lucide-react";
import { formatDate } from "../utils/date";

const priorityClass = {
  Low: "bg-sky-50 text-sky-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700"
};

const TaskCard = ({ task, onEdit, onDelete, onOpenComments }) => {
  return (
    <article
      draggable
      onDragStart={(event) => event.dataTransfer.setData("taskId", task._id)}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold">{task.title}</h4>
          <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${priorityClass[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" onClick={() => onEdit(task)}>
            <Pencil size={15} />
          </button>
          <button className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50" onClick={() => onDelete(task)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{task.description || "No description."}</p>
      <div className="mt-4 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <UserRound size={15} />
          <span>{task.assignedUser || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={15} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>
      <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700" onClick={() => onOpenComments(task)}>
        <MessageSquare size={15} />
        Comments
      </button>
    </article>
  );
};

export default TaskCard;
