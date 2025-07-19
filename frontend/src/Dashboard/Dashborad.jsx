import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import LeftSide from "./LeftSide/AllUsers";
import ChatMessages from "./RightSide/Messages.jsx";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/api.js";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUsersList, setOnlineUsersList] = useState([]);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [activePanel, setActivePanel] = useState("left"); // "left" or "right"

  // Track window resize for responsive switch
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load token, userId, fetch users, initialize socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.id);

    const fetchUsersAndMe = async () => {
      try {
        const usersRes = await axios.get(`${BASE_URL}/api/message/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsersAndMe();

    const newSocket = io(BASE_URL, {
      auth: { token },
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Track online users
  useEffect(() => {
    if (!socket || !currentUserId) return;

    socket.emit("join", currentUserId);
    socket.on("getUsers", (users) => {
      const userIds = users.map((u) => u.userId);
      setOnlineUsers(userIds);
    });

    return () => socket.off("getUsers");
  }, [socket, currentUserId]);

  // Persist selected user in localStorage
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
    if (isMobileView) setActivePanel("right"); // Switch to chat view
  };

  // Restore selected user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Mobile Top Navbar */}
      {isMobileView && (
        <div className="flex justify-between items-center 
 bg-purple-950 backdrop-blur-md border border-white/20 
  text-white p-3 md:hidden  shadow-lg">
          <button
            onClick={() => setActivePanel("left")}
            className={`px-3 py-1 rounded ${activePanel === "left" ? "bg-purple-900" : ""}`}
          >
            Contacts
          </button>
          <span className="font-bold text-xl text-purple-400 ">Chat App</span>
          <button
            onClick={() => setActivePanel("right")}
            className={`px-3 py-1 rounded ${activePanel === "right" ? "bg-purple-900" : ""}`}
            disabled={!selectedUser}
          >
            Chat
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 flex-row w-full h-full overflow-hidden">
        {/* LEFT PANEL */}
        {(!isMobileView || activePanel === "left") && (
          <div
            className={`
          flex flex-col h-full overflow-hidden
          ${isMobileView ? "w-full" : "w-[25%] max-w-[320px] min-w-[260px] border-r border-gray-300"}
        `}
          >
            <LeftSide
              users={users}
              onSelectUser={handleUserSelect}
              currentUserId={currentUserId}
              onlineUsers={onlineUsers}
              onlineUsersList={onlineUsersList}
              setOnlineUsersList={setOnlineUsersList}
              selectedUser={selectedUser}
            />
          </div>
        )}

        {/* RIGHT PANEL */}
        {(!isMobileView || activePanel === "right") && (
          <div
            className={`
          flex flex-col h-full min-w-0 overflow-hidden
          ${isMobileView ? "w-full" : "flex-1 bg-gray-50"}
        `}
          >
            {selectedUser ? (
              <ChatMessages
                selectedUser={selectedUser}
                currentUserId={currentUserId}
                socket={socket}
                onlineUsers={onlineUsers}
                onlineUsersList={onlineUsersList}
                setOnlineUsersList={setOnlineUsersList}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                Select a user to start chatting
              </div>
            )}
          </div>
        )}
      </div>
    </div>


  );
};

export default Dashboard;
