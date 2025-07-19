import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroupForm = () => {
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [memberEmails, setMemberEmails] = useState([""]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleMemberEmailChange = (index, value) => {
    const newEmails = [...memberEmails];
    newEmails[index] = value;
    setMemberEmails(newEmails);
  };

  const addMemberField = () => {
    if (memberEmails.length < 20) {
      setMemberEmails([...memberEmails, ""]);
    }
  };

  const removeMemberField = (index) => {
    const newEmails = [...memberEmails];
    newEmails.splice(index, 1);
    setMemberEmails(newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating group...");

    try {
      const response = await axios.post("http://localhost:3000/api/groups/create-group", {
        name,
        adminEmail,
        memberEmails: memberEmails.filter(email => email.trim() !== ""),
      });

      setMessage(`Group "${response.data.name}" created successfully!`);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      setMessage(` Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-purple-950 text-white px-4">
      <div className="w-full max-w-md  bg-opacity-1 backdrop-blur-md p-6 rounded-xl shadow-md backdrop-blur-lg border border-purple-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Group Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter group name"
              className="w-full px-3 py-2 rounded bg-purple-950 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1">Admin Email:</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
              placeholder="Enter admin email"
              className="w-full px-3 py-2 rounded bg-purple-950 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1">Member Emails:</label>
            {memberEmails.map((email, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleMemberEmailChange(index, e.target.value)}
                  placeholder={`Member ${index + 1} email`}
                  required
                  className="flex-1 px-3 py-2 rounded bg-purple-950 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {memberEmails.length > 1 && (
                  <button type="button" onClick={() => removeMemberField(index)} className="text-red-400 hover:text-red-600">❌</button>
                )}
              </div>
            ))}
            {memberEmails.length < 20 && (
              <button type="button" onClick={addMemberField} className="text-green-400 hover:text-green-600">➕ Add Member</button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded transition duration-200"
          >
            Create Group
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-center ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroupForm;
