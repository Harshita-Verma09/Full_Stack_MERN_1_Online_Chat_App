


const Bubble = ({ msg, isMine, currentUserId }) => {
  const bubbleBase =
    "max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm break-words whitespace-pre-wrap";

  // Prefer msg.text (AI Chat), fallback to msg.content (Private Chat)
  const messageText = msg.text || msg.content;

  return (
    <div className={`w-full flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`${bubbleBase} ${
          isMine
            ? "bg-purple-600 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {/* Show message content */}
        <div>{messageText}</div>

        <div className="text-[10px] mt-1 text-right flex items-center gap-1 justify-end">
          {msg?.createdAt && !isNaN(new Date(msg.createdAt)) && (
            <span className={isMine ? "text-white" : "text-gray-600"}>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          {/* Only show ticks if msg was sent by current user */}
          {(msg.sender === currentUserId || msg.sender?._id === currentUserId) && (
            <span
              className={`ml-2 leading-none ${
                msg.read ? "text-green-400" : "text-gray-400"
              }`}
            >
              {msg.read ? (
                <>
                  <span>✔</span>
                  <span>✔</span>
                </>
              ) : (
                <span>✔</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bubble;
