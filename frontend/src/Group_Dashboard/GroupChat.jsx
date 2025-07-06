

// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Bubble from "../Dashboard/RightSide/InsideMsg/Bubble";
// import TypeInput from "../Dashboard/RightSide/InsideMsg/TypeInput";
// import AddMember from "../Group_Dashboard/AddMembers";
// import RemoveMember from "../Group_Dashboard/RemoveMember";

// const GroupChat = () => {
//   const { group } = useParams();
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const currentUserName = storedUser?.name || "Guest";

//   const [showAdd, setShowAdd] = useState(false);
//   const [showRemove, setShowRemove] = useState(false);
//   const [showMembers, setShowMembers] = useState(false);
//   const [groupMembers, setGroupMembers] = useState([]);

//   const containerRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const [isAuthorized, setIsAuthorized] = useState(null); // null = checking, false = blocked


//   // 🔹 Scroll handlers
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleScroll = () => {
//     if (!containerRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
//     setShowScrollButton(!isAtBottom);
//   };

//   // 🔹 Load group messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/groups/${encodeURIComponent(group)}/messages`,
//           { credentials: "include" }
//         );
//         if (!res.ok) throw new Error("Failed to fetch group messages");
//         const data = await res.json();
//         // setMessages(data);
//         setMessages(data.messages || []); // ✅ FIX HERE
//       } catch (err) {
//         console.error("❌ Error fetching group messages:", err.message);
//         setError("Could not load messages");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (group) fetchMessages();
//   }, [group]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // 🔹 Load group members when "All Members" view is active
//   useEffect(() => {
//     const fetchGroupMembers = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/groups/${group}/all-members`
//         );
//         const data = await res.json();
//         setGroupMembers(data.members || []);
//       } catch (err) {
//         console.error("Error fetching group members:", err.message);
//       }
//     };

//     if (showMembers) fetchGroupMembers();
//   }, [showMembers, group]);

//   // 🔹 Send message
//   const sendMessage = async () => {
//     if (!newMsg.trim()) return;

//     try {
//       const res = await fetch(
//         `http://localhost:3000/api/groups/${encodeURIComponent(group)}/messages`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             senderName: currentUserName,
//             text: newMsg,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             senderName: data.sender || currentUserName,
//             text: data.text,
//             sentAt: data.sentAt || new Date().toISOString(),
//           },
//         ]);
//         setNewMsg("");
//       } else {
//         alert(data.error || "Failed to send message");
//         console.error("❌ Failed to send message:", data.error);
//       }
//     } catch (err) {

//       console.error("❌ Send message error:", err.message);
//     }
//   };

//   return (
//     <div className="relative h-screen w-full bg-gradient-to-b from-purple-950 to-black text-white flex flex-col overflow-hidden">
//       {/* 🔼 Header */}
//       <div className="flex items-center justify-between px-4 py-3 shadow-md">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="text-white font-semibold bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded"
//         >
//           ← Back
//         </button>
//         <h2 className="text-xl font-bold">{group}</h2>
//         <div className="w-16"></div>
//       </div>

//       {/* ➕➖👥 Controls */}
//       <div className="flex gap-4 items-center justify-center py-2 border-b shadow-md">
//         <button
//           onClick={() => {
//             setShowAdd(true);
//             setShowRemove(false);
//             setShowMembers(false);
//           }}
//           className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white text-sm m-2"
//         >
//           Add Member
//         </button>
//         <button
//           onClick={() => {
//             setShowRemove(true);
//             setShowAdd(false);
//             setShowMembers(false);
//           }}
//           className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white text-sm"
//         >
//           Remove Member
//         </button>
//         <button
//           onClick={() => {
//             // Toggle visibility instead of forcing true
//             setShowMembers((prev) => !prev);
//             setShowAdd(false);
//             setShowRemove(false);
//           }}
//           className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-sm"
//         >
//           All Members
//         </button>
//       </div>

//       {/* 🧩 Injected Components */}
//       {showAdd && (
//         <AddMember
//           groupName={group}
//           adminEmail={storedUser.email}
//           onSuccess={() => alert("✅ Member added successfully!")}
//           onClose={() => setShowAdd(false)}
//         />
//       )}

//       {showRemove && (
//         <RemoveMember
//           groupName={group}
//           adminEmail={storedUser.email}
//           onSuccess={() => alert("✅ Member removed successfully!")}
//           onClose={() => setShowRemove(false)}
//         />
//       )}

//       {/* 👥 Group Members List */}
//       {showMembers && (
//         <div className="bg-purple-950 p-4 rounded-lg mx-4 my-2 max-h-60 overflow-y-auto shadow-inner">
//           <h3 className="text-white font-semibold mb-2 text-lg text-center underline">
//             Group Members
//           </h3>
//           {groupMembers.length === 0 ? (
//             <p className="text-gray-300 text-sm">No members found.</p>
//           ) : (
//             <ul className="space-y-1 text-sm text-white">
//               {groupMembers.map((member, idx) => (
//                 <li
//                   key={idx}
//                   className="flex justify-between border-b border-gray-600 py-1"
//                 >
//                   <span>{member.name}</span>
//                   <span className="text-gray-300 text-xs">{member.email}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}

//       {/* 💬 Messages Area */}
//       <div
//         className="flex-1 overflow-y-auto p-4"
//         ref={containerRef}
//         onScroll={handleScroll}
//       >
//         {loading && <p className="text-gray-400">Loading messages...</p>}
//         {error && <p className="text-red-400">{error}</p>}
//         {!loading && messages.length === 0 && (
//           <p className="text-gray-500">No messages yet in this group.</p>
//         )}
//         {messages.map((msg, index) => {
//           const isMine = msg.senderName === currentUserName;
//           const timeString = new Date(msg.sentAt || msg.createdAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           return (
//             <div key={index} className="mb-4">
//               <div
//                 className={`text-xs font-semibold mb-1 px-1 ${isMine ? "text-right text-purple-200" : "text-left text-purple-300"
//                   }`}
//               >
//                 {isMine ? "You" : msg.senderName}
//               </div>
//               <Bubble msg={msg} isMine={isMine} currentUserId={currentUserName} />
//               <div
//                 className={`text-[10px] mt-1 px-1 ${isMine ? "text-right text-white" : "text-left text-gray-400"
//                   }`}
//               >
//                 {timeString}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ⬇️ Scroll to Bottom Button */}
//       {showScrollButton && (
//         <div className="absolute bottom-20 right-4">
//           <button
//             onClick={scrollToBottom}
//             className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition duration-200"
//             title="Go to Bottom"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//         </div>
//       )}

//       {/* ✍️ Type Message */}
//       <div className="p-2">
//         <TypeInput
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           onSend={sendMessage}
//         />
//       </div>
//     </div>
//   );
// };

// export default GroupChat;






















import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Bubble from "../Dashboard/RightSide/InsideMsg/Bubble";
import TypeInput from "../Dashboard/RightSide/InsideMsg/TypeInput";
import AddMember from "../Group_Dashboard/AddMembers";
import RemoveMember from "../Group_Dashboard/RemoveMember";
import { BASE_URL } from "../utils/api";

const GroupChat = () => {
  const { group } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserName = storedUser?.name || "Guest";

  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null); // 🔐 Group access control

  // 🔐 Check if user has access to this group
  useEffect(() => {
    const checkGroupAccess = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/groups/my-groups/${storedUser.email}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Access check failed");

        const allowedGroups = data.groups.map((g) => g.name);
        setIsAuthorized(allowedGroups.includes(group));
      } catch (err) {
        console.error("❌ Group access check failed:", err.message);
        setIsAuthorized(false);
      }
    };

    if (storedUser?.email && group) {
      checkGroupAccess();
    }
  }, [group, storedUser?.email]);

  // 🔹 Scroll handlers
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!isAtBottom);
  };

  // 🔹 Load group messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BASE_URL}/api/groups/${encodeURIComponent(group)}/messages`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch group messages");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("❌ Error fetching group messages:", err.message);
        setError("Could not load messages");
      } finally {
        setLoading(false);
      }
    };

    if (group && isAuthorized) fetchMessages();
  }, [group, isAuthorized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔹 Load group members
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/groups/${group}/all-members`
        );
        const data = await res.json();
        setGroupMembers(data.members || []);
      } catch (err) {
        console.error("Error fetching group members:", err.message);
      }
    };

    if (showMembers) fetchGroupMembers();
  }, [showMembers, group]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await fetch(
       `${BASE_URL}/api/groups/${encodeURIComponent(group)}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            senderName: currentUserName,
            text: newMsg,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            senderName: data.sender || currentUserName,
            text: data.text,
            sentAt: data.sentAt || new Date().toISOString(),
          },
        ]);
        setNewMsg("");
      } else {
        alert(data.error || "Failed to send message");
        console.error("❌ Failed to send message:", data.error);
      }
    } catch (err) {
      console.error("❌ Send message error:", err.message);
    }
  };

  // 🔒 Render access guard
  if (isAuthorized === null) {
    return (
      <div className="text-white text-center mt-10">Checking group access...</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 mx-4 p-6 rounded-lg bg-gradient-to-br from-purple-950 via-purple-800 to-black shadow-lg border border-purple-700">
        <h2 className="text-red-400 text-xl font-bold text-center mb-2">
           You are not authorized to access this group.
        </h2>
        <p className="text-purple-200 text-sm text-center mb-6">
          Only group members or the admin can view this group.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full shadow-md transition duration-200"
        >
          Go Back to Dashboard
        </button>
      </div>

    );
  }

  // ✅ Render full chat UI
  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-purple-950 to-black text-white flex flex-col overflow-hidden">
      {/* 🔼 Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-md">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white font-semibold bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold">{group}</h2>
        <div className="w-16"></div>
      </div>

      {/* ➕➖👥 Controls */}
      <div className="flex gap-4 items-center justify-center py-2 border-b shadow-md">
        <button
          onClick={() => {
            setShowAdd(true);
            setShowRemove(false);
            setShowMembers(false);
          }}
          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white text-sm m-2"
        >
          Add Member
        </button>
        <button
          onClick={() => {
            setShowRemove(true);
            setShowAdd(false);
            setShowMembers(false);
          }}
          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white text-sm"
        >
          Remove Member
        </button>
        <button
          onClick={() => {
            setShowMembers((prev) => !prev);
            setShowAdd(false);
            setShowRemove(false);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-sm"
        >
          All Members
        </button>
      </div>

      {/* 🧩 Injected Components */}
      {showAdd && (
        <AddMember
          groupName={group}
          adminEmail={storedUser.email}
          onSuccess={() => alert("✅ Member added successfully!")}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showRemove && (
        <RemoveMember
          groupName={group}
          adminEmail={storedUser.email}
          onSuccess={() => alert("✅ Member removed successfully!")}
          onClose={() => setShowRemove(false)}
        />
      )}

      {/* 👥 Group Members List */}
      {showMembers && (
        <div className="bg-purple-950 p-4 rounded-lg mx-4 my-2 max-h-60 overflow-y-auto shadow-inner">
          <h3 className="text-white font-semibold mb-2 text-lg text-center underline">
            Group Members
          </h3>
          {groupMembers.length === 0 ? (
            <p className="text-gray-300 text-sm">No members found.</p>
          ) : (
            <ul className="space-y-1 text-sm text-white">
              {groupMembers.map((member, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b border-gray-600 py-1"
                >
                  <span>{member.name}</span>
                  <span className="text-gray-300 text-xs">{member.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 💬 Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {loading && <p className="text-gray-400">Loading messages...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-gray-500">No messages yet in this group.</p>
        )}
        {messages.map((msg, index) => {
          const isMine = msg.senderName === currentUserName;
          const timeString = new Date(msg.sentAt || msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={index} className="mb-4">
              <div
                className={`text-xs font-semibold mb-1 px-1 ${isMine ? "text-right text-purple-200" : "text-left text-purple-300"}`}
              >
                {isMine ? "You" : msg.senderName}
              </div>
              <Bubble msg={msg} isMine={isMine} currentUserId={currentUserName} />
              <div
                className={`text-[10px] mt-1 px-1 ${isMine ? "text-right text-white" : "text-left text-gray-400"}`}
              >
                {timeString}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ⬇️ Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-4">
          <button
            onClick={scrollToBottom}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition duration-200"
            title="Go to Bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* ✍️ Type Message */}
      <div className="p-2">
        <TypeInput
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
};

export default GroupChat;
