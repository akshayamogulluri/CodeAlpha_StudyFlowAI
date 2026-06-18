import { Save } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await updateProfile(form);
      setStatus("Profile updated.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Keep your StudyFlow identity current for team comments.</p>
      </div>
      <form className="panel space-y-5 p-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <img
            src={form.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${form.name || "Student"}`}
            alt={form.name}
            className="h-20 w-20 rounded-full border border-slate-200 bg-white"
          />
          <div>
            <p className="font-bold">{user?.email}</p>
            <p className="text-sm text-slate-500">Email is used for login and team membership.</p>
          </div>
        </div>
        <label className="block text-sm font-semibold">
          Name
          <input
            className="input mt-1"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          Avatar URL
          <input
            className="input mt-1"
            value={form.avatar}
            onChange={(event) => setForm({ ...form, avatar: event.target.value })}
            placeholder="https://example.com/avatar.png"
          />
        </label>
        {status && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{status}</p>}
        <button className="btn-primary" disabled={loading}>
          <Save size={16} />
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
