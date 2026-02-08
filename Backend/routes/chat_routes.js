const express = require("express");
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
    const { message, context } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant for the Cosmic Watch dashboard. Use the provided context to answer." },
                    { role: "user", content: `Dashboard data: ${JSON.stringify(context)}. Question: ${message}` }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        res.json({ reply });
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ error: "Failed to get response from OpenAI" });
    }
});

module.exports = router;
