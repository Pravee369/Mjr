const express = require("express");
const router = express.Router();
const fuzz = require('fuzzball');
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

  const prompts = chatbotData.map(item => item.prompt);

  // Fuzzy Search for best match
  const [bestMatch, bestScore, bestIndex] = fuzz.extract(userMessage, prompts, { scorer: fuzz.token_set_ratio })[0];

  console.log("User Query:", userMessage);
  console.log("Best Match:", bestMatch);
  console.log("Matching Score:", bestScore);

  if (bestScore > 60) { // Threshold can be adjusted
    const matchedResponse = chatbotData[bestIndex].response;
    return res.json({ response: [{ generated_text: matchedResponse }] });
  } else {
    return res.json({ response: [{ generated_text: "Sorry, I couldn't find an answer for that." }] });
  }
});

module.exports = router;
