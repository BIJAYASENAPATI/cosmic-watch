import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = ({ dashboardData }) => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hello! I can help you with your dashboard data." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { from: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    context: dashboardData
                }),
            });
            const data = await response.json();
            const botMessage = { from: "bot", text: data.reply || "Sorry, I can't answer that." };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage = { from: "bot", text: "Failed to get response." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className={`chatbot-container ${open ? "open" : ""}`}>
            <div className="chatbot-header" onClick={() => setOpen(!open)}>
                {open ? "Close Chat" : "Ask Bot"}
            </div>

            {open && (
                <div className="chatbot-body">
                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chatbot-message ${msg.from}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="chatbot-message bot">...</div>}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            placeholder="Ask me about your dashboard..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
