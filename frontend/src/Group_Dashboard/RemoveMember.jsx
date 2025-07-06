import { useState } from "react";
import { BASE_URL } from "../utils/api";

const RemoveMember = ({ groupName, adminEmail, onSuccess, onClose }) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRemove = async () => {
    if (!memberEmail.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/groups/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupName, adminEmail, memberEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSuccess?.(data);
      setMemberEmail("");
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3  flex items-center gap-2">
      <input
        type="email"
        placeholder="Member's Email to remove"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        className="bg-purple-800 text-white px-3 py-1 rounded flex-1 outline-none"
      />
      <button
        onClick={handleRemove}
        disabled={loading}
        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? "Removing..." : "Remove"}
      </button>
      <button onClick={onClose} className="text-gray-300 text-sm">✖</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default RemoveMember;
