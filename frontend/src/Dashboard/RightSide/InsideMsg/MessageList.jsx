import Bubble from "./Bubble";

const MessageList = ({ messages, currentUserId, loading, bottomRef }) => {
  // console.log(" List_messages", messages, " List_CurrentUserID", currentUserId);

  return (
    <div className="flex flex-col overflow-y-auto p-4 space-y-2 bg-black w-full">
      {loading ? (
        <div>Loading messages...</div>
      ) : messages.length === 0 ? (
        <div>No messages yet.</div>
      ) : (
        messages.map((msg) => {
          //  console.log(" Each Message Example:", msg[0]);
          // console.log( "msg.sender", msg.senderName);
          // console.log("  currentUserId", currentUserId);
          // console.log(" msg.sender === currentUserId:", msg.sender === currentUserId);
          // console.log(" msg.sender?._id === currentUserId:", msg.sender?._id === currentUserId);

          return (
            <Bubble
             key={msg._id + "-" + (msg.read ? "r" : "u")}
              msg={msg}
              isMine={
                msg.sender === currentUserId ||
                msg.sender?._id === currentUserId ||
                msg.senderId === currentUserId
              }
              currentUserId={currentUserId}
            />

          );
        })
      )}
      <div ref={bottomRef} /> 
    </div>
  );
};

export default MessageList;
