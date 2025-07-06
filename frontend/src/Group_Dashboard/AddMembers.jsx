import { useState } from "react";
import { BASE_URL } from "../utils/api";

const AddMember = ({ groupName, adminEmail, onSuccess, onClose }) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!memberEmail.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/groups/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupName, adminEmail, memberEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSuccess?.(data); // Optional callback
      setMemberEmail("");
      onClose?.(); // Optional close callback
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 flex items-center gap-2">
      <input
        type="email"
        placeholder="Member's Email"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        className="bg-purple-800 text-white px-3 py-1 rounded flex-1 outline-none"
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      <button onClick={onClose} className="text-gray-300 text-sm">✖</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default AddMember;
