import { useState } from "react";
import { FaSmile, FaPaperPlane, FaMicrophone } from "react-icons/fa";
import Speech from "./Speech";

const TypeInput = ({ value, onChange, onSend }) => {
  const [isListening, setIsListening] = useState(false);

  const handleSpeechResult = (text) => {
    // onChange(value + " " + text);
     onChange({ target: { value: value + " " + text } }); // Mocks real event
  };

  return (
    <div className="p-3 sm:p-4 border-t border-gray-700 flex items-center gap-2 sm:gap-3 bg-black">
      {/* Mic Icon */}
      <button
        className={`text-lg sm:text-xl ${isListening ? "text-green-400" : "text-gray-400"} hover:text-white`}
        onClick={() => setIsListening((prev) => !prev)}
      >
        <FaMicrophone />
      </button>

      {/* Emoji Icon */}
      <button className="text-gray-400 hover:text-white text-lg sm:text-xl">
        <FaSmile />
      </button>

      {/* Text Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      {/* Send Button */}
      <button
        onClick={onSend}
        className="bg-purple-700 hover:bg-purple-800 text-white p-2 sm:px-4 sm:py-2 rounded-lg transition flex items-center justify-center"
      >
        <FaPaperPlane className="text-white text-sm sm:text-base" />
      </button>

      {/* Speech Recognition Component */}
      <Speech
        onResult={handleSpeechResult}
        isListening={isListening}
        setIsListening={setIsListening}
      />
    </div>
  );
};

export default TypeInput;
