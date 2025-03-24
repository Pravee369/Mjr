const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

require('dotenv').config();

async function getChatbotResponse(userMessage) {
    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/facebook/blenderbot-400M-distill",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: userMessage })
            });

        if (!response.ok) {
            console.error("API Error:", response.statusText);
            return { error: `API Error: ${response.statusText}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Chatbot API error:", error);
        return "Sorry, I'm facing an issue right now.";
    }
}

// Define the chatbot route here
router.post("/message", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const botResponse = await getChatbotResponse(userMessage);
        res.json({ response: botResponse });
    } catch (error) {
        console.error("Chatbot API error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
