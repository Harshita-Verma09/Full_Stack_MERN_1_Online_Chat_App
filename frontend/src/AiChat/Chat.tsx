// src/AiChat/Chat.tsx
import React, { useEffect, useState } from 'react';
import { sendMessageToAI, fetchAIHistory } from '../services/api';
import Bubble from '../Dashboard/RightSide/InsideMsg/Bubble.jsx';
import TypeInput from "../Dashboard/RightSide/InsideMsg/TypeInput.jsx"
import { useNavigate } from 'react-router-dom';


interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('selectedUser') || '{}'); 
    const userId = user?._id;

    //  Load chat history
    useEffect(() => {
        if (!userId) return;

        const loadHistory = async () => {
            try {
                const history = await fetchAIHistory(userId);
                const allMessages = history.flatMap((chat: any) => chat.messages);
                setMessages(allMessages);
            } catch (err) {
                console.error(" Failed to load chat history:", err);
            }
        };

        loadHistory();
    }, [userId]);

    const sendMessage = async () => {
        if (!input.trim() || !userId) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput(''); // clear input

        try {
            const aiReply = await sendMessageToAI(userId, input);
            const aiMessage: Message = { sender: 'ai', text: aiReply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(" AI Response Error:", err);
        }
    };


    return (
        <div className="h-screen w-full bg-black text-white flex flex-col">

            {/*Go to Dashboard Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="m-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg self-start"
            >
                Go to Dashboard
            </button>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, idx) => (
                    <Bubble
                        key={idx}
                        msg={msg}
                        isMine={msg.sender === 'user'}
                        currentUserId="user"
                    />
                ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-gray-700">
                <TypeInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onSend={sendMessage}
                />
            </div>
        </div>
    );

}

export default Chat;
