
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatHeader from "./InsideMsg/ChatHeader";
import MessageList from "./InsideMsg/MessageList";
import TypeInput from "./InsideMsg/TypeInput";
import "../../App.css";
import TopBottom from "./InsideMsg/TopBottom";

const Messages = ({ selectedUser, currentUserId, socket, onlineUsers, onlineUsersList, setOnlineUsersList }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedUser?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/message/chat/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/message/send",
        {
          receiverId: selectedUser._id,
          content: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sentMsg = res.data.data;
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === sentMsg._id);
        return exists ? prev : [...prev, sentMsg];
      });
      setNewMessage("");
      socket?.emit("sendMessage", sentMsg);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  // Mark messages as read
  const markAsRead = async () => {
    if (!selectedUser?._id) return;
    try {
      await axios.put(
        `http://localhost:3000/api/message/read/${selectedUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket?.emit("messagesRead", {
        readerId: currentUserId,
        senderId: selectedUser._id,
      });
    } catch (err) {
      console.error("❌ Failed to mark messages as read", err);
    }
  };

  // Listen for incoming messages and read receipts
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (
        message.sender?._id === selectedUser?._id ||
        message.sender?._id === currentUserId
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id);
          return exists ? prev : [...prev, message];
        });

        if (message.sender?._id !== currentUserId) {
          markAsRead();
        }
      }
    };

    const handleMessagesRead = ({ readerId, senderId }) => {
      if (selectedUser?._id !== readerId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          const senderMatch =
            msg.sender === senderId || msg.sender?._id === senderId;
          const receiverMatch =
            msg.receiver === readerId || msg.receiver?._id === readerId;
          const isTarget = senderMatch && receiverMatch;
          const alreadyRead = msg.read;

          if (isTarget && !alreadyRead) {
            return { ...msg, read: true };
          }
          return msg;
        })
      );
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, selectedUser, currentUserId]);

  // On user change
  useEffect(() => {
    if (!selectedUser?._id) return;
    fetchMessages();
    markAsRead();
  }, [selectedUser]);

  // Scroll to bottom on message change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Join socket room
  useEffect(() => {
    if (socket && currentUserId) {
      socket.emit("join", currentUserId);
    }
  }, [socket, currentUserId]);


  useEffect(() => {
    if (!socket) return;

    const handleOnlineUpdate = (onlineIds) => {
      setOnlineUsersList(onlineIds);
    };

    socket.on("updateOnlineUsers", handleOnlineUpdate);

    return () => {
      socket.off("updateOnlineUsers", handleOnlineUpdate);
    };
  }, [socket, setOnlineUsersList]);


  return (
  //   <div className="w-full sm:w-[90%] md:w-[100vw] h-[100vh] sm:h-[90vh] md:h-[100vh] bg-black text-white flex flex-col px-4 sm:px-6 md:px-1 mx-auto mb-[55px] md:mt-0">
  //     <ChatHeader
  //       user={selectedUser}
  //       onlineUsersList={onlineUsersList}
  //       onlineUsers={onlineUsers}
  //     />

  //     {selectedUser?._id ? (
  //       <>
  //         <div className="flex-1 overflow-y-auto scroll-smooth relative" ref={scrollRef}>
  //           <MessageList
  //             messages={messages}
  //             currentUserId={currentUserId}
  //             loading={loading}
  //             bottomRef={bottomRef}
  //           />
  //           <TopBottom scrollRef={scrollRef} bottomRef={bottomRef} />
  //         </div>

  //         <TypeInput
  //           value={newMessage}
  //           onChange={(e) => setNewMessage(e.target.value)}
  //           onSend={handleSend}
  //         />
  //       </>
  //     ) : (
  //       <div className="flex-1 flex items-center justify-center text-gray-500 text-sm sm:text-base">
  //         Select a user to start messaging
  //       </div>
  //     )}
  //   </div>
  // );

    <div className="w-full h-full bg-black text-white flex flex-col ">
      {/* Chat Header */}
      <ChatHeader
        user={selectedUser}
        onlineUsersList={onlineUsersList}
        onlineUsers={onlineUsers}
      />

      {selectedUser?._id ? (
        <>
          {/* Messages list */}
          <div
            className="flex-1 overflow-y-auto scroll-smooth relative custom-scrollbar"
            ref={scrollRef}
          >
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              loading={loading}
              bottomRef={bottomRef}
            />
            <TopBottom scrollRef={scrollRef} bottomRef={bottomRef} />
          </div>

          {/* Message input */}
          <TypeInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSend={handleSend}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm sm:text-base">
          Select a user to start messaging
        </div>
      )}
    </div>
  );

};

export default Messages;
