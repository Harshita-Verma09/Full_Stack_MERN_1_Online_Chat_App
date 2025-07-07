


import { useEffect, useRef, useState } from "react";
import { Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/api.js";



const AllUsers = ({ users, onSelectUser, currentUserId, onlineUsersList }) => {
  const navigate = useNavigate();
  const resizableRef = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [groups, setGroups] = useState([]);


  // Logout Handler
  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Sidebar Resizer
  useEffect(() => {
    const resizable = resizableRef.current;
    const onMouseDown = (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = resizable.offsetWidth;

      const onMouseMove = (e) => {
        const newWidth = startWidth + e.clientX - startX;
        resizable.style.width = `${newWidth}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const handle = document.createElement("div");
    handle.className =
      "w-1 bg-gray-600 cursor-col-resize h-full absolute top-0 right-0";
    handle.addEventListener("mousedown", onMouseDown);
    resizable.appendChild(handle);

    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      if (resizable.contains(handle)) resizable.removeChild(handle);
    };
  }, []);

  // Fetch Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/groups/all-groups`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error("Error fetching groups:", err.message);
      }
    };
    fetchGroups();
  }, []);

  // Filtered users for search
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
    onSelectUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    // <div
    //   ref={resizableRef}
    //   className="relative bg-gradient-to-b from-purple-950 to-black text-white p-4 overflow-hidden 
    //          h-full w-full md:w-[25%] min-w-[200px] max-w-[600px]"
    // >
    //   <h2 className="text-xl text-center font-bold mb-2">All Chat Users</h2>

    //   {/* Search Input */}
    //   <div className="relative mb-4">
    //     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    //     <input
    //       type="text"
    //       placeholder="Search users..."
    //       value={search}
    //       onChange={(e) => setSearch(e.target.value)}
    //       className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
    //     />
    //   </div>

    //   {/* Scrollable content: groups + users */}
    //   <div className="overflow-y-auto pr-2 space-y-4 max-h-[calc(100vh-180px)]">

    //     {/* Group Section */}
    //     <div>
    //       <button
    //         onClick={() => setShowGroups(!showGroups)}
    //         className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg transition"
    //       >
    //         Groups
    //       </button>

    //       {showGroups && (
    //         <div className="mt-2 space-y-2">
    //           <button
    //             onClick={() => navigate("/create-group")}
    //             className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-md"
    //           >
    //             Create Group
    //           </button>

    //           {groups.length === 0 ? (
    //             <p className="text-sm text-gray-400 text-center">No groups found</p>
    //           ) : (
    //             groups.map((group) => {
    //               const nameParts = group.name.trim().split(" ");
    //               const initials =
    //                 nameParts.length >= 2
    //                   ? `${nameParts[0][0]}${nameParts[1][0]}`
    //                   : nameParts[0][0];
    //               return (
    //                 <div
    //                   key={group._id}
    //                   onClick={() => navigate(`/groups/${group.name}`)}
    //                   className="flex items-center gap-4 p-3 rounded-lg border border-gray-700 transition duration-200 cursor-pointer hover:bg-gray-700"
    //                 >
    //                   <div className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center text-white text-sm font-semibold">
    //                     {initials.toUpperCase()}
    //                   </div>
    //                   <span className="text-white text-[15px] font-medium">
    //                     {group.name}
    //                   </span>
    //                 </div>
    //               );
    //             })
    //           )}
    //           <hr />
    //         </div>
    //       )}
    //     </div>

    //     {/* User List */}
    //     <div>
    //       {filteredUsers.map((user) => {
    //         const nameParts = user.name?.trim().split(" ");
    //         const initials =
    //           nameParts.length >= 2
    //             ? `${nameParts[0][0]}${nameParts[1][0]}`
    //             : nameParts[0][0];
    //         const isOnline = onlineUsersList?.includes(user._id);
    //         const isSelected = selectedUserId === user._id;

    //         return (
    //           <div
    //             key={user._id}
    //             onClick={() => handleUserClick(user)}
    //             className={`flex items-center gap-4 p-3 mb-2 rounded-lg border border-gray-700 transition duration-200 cursor-pointer hover:bg-gray-700 ${isSelected ? "border-4 border-purple-500" : ""
    //               }`}
    //           >
    //             <div className="relative">
    //               <div className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center text-white text-sm font-semibold">
    //                 {initials.toUpperCase()}
    //               </div>
    //               {isOnline && (
    //                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
    //               )}
    //             </div>
    //             <span className="text-white text-[16px] font-medium">
    //               {user._id === currentUserId ? "Me" : user.name}
    //             </span>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>

    //   {/* Logout */}
    //   <button
    //     onClick={handleLogout}
    //     className="absolute bottom-4 left-4 p-2 rounded-full bg-gray-800 hover:bg-red-600 text-white transition"
    //   >
    //     <LogOut size={20} />
    //   </button>
    // </div>

    <div
      ref={resizableRef}
      className="relative bg-gradient-to-b from-purple-950 to-black text-white p-4 overflow-hidden 
               h-full w-full  md:min-w-[260px] md:max-w-[320px] border-r border-gray-800"
    >
      <h2 className="text-xl text-center font-bold mb-3">All Chat Users</h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
      </div>

      {/* Scrollable section */}
      <div className="overflow-y-auto pr-2 space-y-4 max-h-[calc(100vh-180px)] custom-scrollbar">
        {/* Groups */}
        <div>
          <button
            onClick={() => setShowGroups(!showGroups)}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg transition"
          >
            Groups
          </button>

          {showGroups && (
            <div className="mt-2 space-y-2">
              <button
                onClick={() => navigate("/create-group")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-md"
              >
                Create Group
              </button>

              {groups.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">No groups found</p>
              ) : (
                groups.map((group) => {
                  const initials = group.name
                    .trim()
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={group._id}
                      onClick={() => navigate(`/groups/${group.name}`)}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-700 transition duration-200 cursor-pointer hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center text-white text-sm font-semibold">
                        {initials}
                      </div>
                      <span className="text-white text-[15px] font-medium">{group.name}</span>
                    </div>
                  );
                })
              )}
              <hr />
            </div>
          )}
        </div>

        {/* Users */}
        <div>
          {filteredUsers.map((user) => {
            const initials = user.name
              ?.trim()
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const isOnline = onlineUsersList?.includes(user._id);
            const isSelected = selectedUserId === user._id;

            return (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-4 p-3 mb-2 rounded-lg border border-gray-700 transition duration-200 cursor-pointer hover:bg-gray-700 ${isSelected ? "border-4 border-purple-500" : ""
                  }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center text-white text-sm font-semibold">
                    {initials}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                  )}
                </div>
                <span className="text-white text-[16px] font-medium">
                  {user._id === currentUserId ? "Me" : user.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute bottom-4 left-4 p-2 rounded-full bg-gray-800 hover:bg-red-600 text-white transition"
      >
        <LogOut size={20} />
      </button>
    </div>
  );

};

export default AllUsers;

