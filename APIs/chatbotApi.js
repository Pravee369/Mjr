const express = require("express");
const router = express.Router();
const stringSimilarity = require('string-similarity');
const fs = require('fs');
const path = require('path');

// Load Dataset
const chatbotData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/chatbot_training_data.json"))
);

router.post("/message", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Extract prompts
  const prompts = chatbotData.map(item => item.prompt);

  // Find best match
  const match = stringSimilarity.findBestMatch(userMessage, prompts);
  const bestMatch = match.bestMatch;

  console.log("User Query:", userMessage);
  console.log("Best Matched Prompt:", bestMatch.target);
  console.log("Match Accuracy:", bestMatch.rating);

  if (bestMatch.rating > 0.4) {   // Confidence Threshold
    const matchedResponse = chatbotData[match.bestMatchIndex].response;
    return res.json({ response: [{ generated_text: matchedResponse }] });
  } else {
    // Optional: Fallback Response
    return res.json({ response: [{ generated_text: "Sorry, I couldn't find an answer for that." }] });
  }
});

module.exports = router;
