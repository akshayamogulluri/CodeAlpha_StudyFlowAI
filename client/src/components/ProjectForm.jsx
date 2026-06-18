import { Save } from "lucide-react";
import { useState } from "react";
import { toInputDate } from "../utils/date";

const ProjectForm = ({ initialProject, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: initialProject?.title || "",
    description: initialProject?.description || "",
    deadline: toInputDate(initialProject?.deadline),
    members: initialProject?.members?.join(", ") || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit({
      ...form,
      members: form.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean)
    });
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold">
        Project Name
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
          className="input mt-1 min-h-28"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </label>
      <label className="block text-sm font-semibold">
        Deadline
        <input
          className="input mt-1"
          type="date"
          value={form.deadline}
          onChange={(event) => setForm({ ...form, deadline: event.target.value })}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Team Members
        <input
          className="input mt-1"
          value={form.members}
          onChange={(event) => setForm({ ...form, members: event.target.value })}
          placeholder="Names or emails, separated by commas"
        />
      </label>
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-primary" disabled={loading}>
          <Save size={16} />
          {loading ? "Saving..." : "Save project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
