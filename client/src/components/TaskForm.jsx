import { Save } from "lucide-react";
import { useState } from "react";
import { toInputDate } from "../utils/date";

const TaskForm = ({ project, initialTask, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    assignedUser: initialTask?.assignedUser || "",
    priority: initialTask?.priority || "Medium",
    status: initialTask?.status || "todo",
    dueDate: toInputDate(initialTask?.dueDate)
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold">
        Task Title
        <input
          className="input mt-1"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Description
        <textarea
          className="input mt-1 min-h-24"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Assign To
          <select
            className="input mt-1"
            value={form.assignedUser}
            onChange={(event) => setForm({ ...form, assignedUser: event.target.value })}
          >
            <option value="">Unassigned</option>
            {project?.members?.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Priority
          <select
            className="input mt-1"
            value={form.priority}
            onChange={(event) => setForm({ ...form, priority: event.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Status
          <select
            className="input mt-1"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Due Date
          <input
            className="input mt-1"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            required
          />
        </label>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-primary" disabled={loading}>
          <Save size={16} />
          {loading ? "Saving..." : "Save task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
