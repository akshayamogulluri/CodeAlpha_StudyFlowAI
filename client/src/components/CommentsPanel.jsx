import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatDate } from "../utils/date";

const CommentsPanel = ({ task }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      const { data } = await api.get(`/comments/${task._id}`);
      setComments(data);
      setLoading(false);
    };

    loadComments();
  }, [task._id]);

  const addComment = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    const { data } = await api.post(`/comments/${task._id}`, { message });
    setComments((current) => [...current, data]);
    setMessage("");
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <h3 className="font-bold">Comments</h3>
      <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-slate-500">Loading comments...</p>
        ) : comments.length ? (
          comments.map((comment) => (
            <div key={comment._id} className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{comment.userId?.name || "Student"}</p>
                <p className="text-xs text-slate-400">{formatDate(comment.timestamp)}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">{comment.message}</p>
            </div>
          ))
        ) : (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No comments yet.</p>
        )}
      </div>
      <form className="mt-4 flex gap-2" onSubmit={addComment}>
        <input
          className="input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Add a comment"
        />
        <button className="btn-primary px-3">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default CommentsPanel;
