
// const ChatHeader = ({ user, onlineUsersList }) => {
//   if (!user) {
//     return (
//       <div className="p-4 border-b bg-blue-500 text-white text-center h-[100px] flex items-center justify-center">
//         <p className="text-base">Select a user to start chatting</p>
//       </div>
//     );
//   }

//   const isOnline =
//     user._id && Array.isArray(onlineUsersList)
//       ? onlineUsersList.includes(String(user._id))
//       : false;

//   // Extract initials
//   const nameParts = user.name?.trim().split(" ") || [];
//   const initials =
//     nameParts.length >= 2
//       ? `${nameParts[0][0]}${nameParts[1][0]}`
//       : nameParts[0]?.[0] || "U";

//   return (
//     <div className="p-4 border-b border-gray-800 bg-black flex items-center gap-4 h-[100px]">
//       <div className="relative">
//         <div className="w-12 h-12 rounded-full  border-2 border-purple-400 flex items-center justify-center text-white text-base font-semibold">
//           {initials.toUpperCase()}
//         </div>
//         {isOnline && (
//           <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
//         )}
//       </div>
//       <div className="flex flex-col">
//         <h2 className="text-white text-lg font-semibold">{user.name}</h2>
//         <p className="text-sm text-gray-400">
//           {isOnline ? "Online" : "Offline"}
//         </p>
//       </div>
//     </div>
//   );
// };
// export default ChatHeader;









import { MessageCircleCode } from "lucide-react";
import { Brain, Sun, Trash2 } from "lucide-react"; // Icons
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user, onlineUsersList }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-4 border-b bg-blue-500 text-white text-center h-[100px] flex items-center justify-center">
        <p className="text-base">Select a user to start chatting</p>
      </div>
    );
  }

  const isOnline =
    user._id && Array.isArray(onlineUsersList)
      ? onlineUsersList.includes(String(user._id))
      : false;

  const nameParts = user.name?.trim().split(" ") || [];
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0]?.[0] || "U";

  // ⬇️ Handle AI Icon Click
  const handleAIClick = () => {
    navigate("/ai-talk"); // ✅ Make sure this route is defined in your frontend router
  };

  return (
   <div className="p-4 border-b border-gray-800 bg-black flex justify-between items-center h-[100px] mt-[55px] md:mt-0">

      {/* Left: User Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-purple-400 flex items-center justify-center text-white text-base font-semibold">
            {initials.toUpperCase()}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-white text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4 text-gray-400 ">
        <button
          onClick={handleAIClick}
          className="hover:text-purple-400 transition border-2 border-purple-400 rounded-full p-2"
          title="AI Assistant"
        >
          <MessageCircleCode size={20} />
        </button>
        <button className="hover:text-yellow-400 transition border-2 border-purple-400 rounded-full p-2 " title="Toggle Theme">
          <Sun size={20} />
        </button>
        <button className="hover:text-red-500 transition border-2 border-purple-400 rounded-full p-2 " title="Delete Chat">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
