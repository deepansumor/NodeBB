// index.js
const { escalationSummaryPrompt } = require("./prompts/escalationSummary");
const buildGeminiPayload = require("./payload");
const outputTemplate = require("./schema");
const { geminiClient } = require("../../gemini/geminiClient");
const fs = require("fs");
const path = require("path");

// Step 1: Read mock data
const mockData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./escalationData.json"), "utf-8")
);
console.log("Mock Data Loaded:", mockData);

// Step 2: Generate AI summary
async function generateAISummary(escalationsData = mockData) {
  try {
    // Prepare prompt in human-readable format
    const prompt = escalationSummaryPrompt(
      escalationsData.map(item => `${item.portfolio}: ${item.summary}`).join("\n\n")
    );
   console.log("Generated Prompt:", prompt);
    // Build Gemini payload
    const payload = buildGeminiPayload(prompt);
 console.log("Gemini Payload:", JSON.stringify(payload, null, 2));
    // Call Gemini API
    const response = await geminiClient.generateContent(payload);
    console.log("Gemini Response:", JSON.stringify(response, null, 2));
    // Parse Gemini response safely
     let textOutput =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ Clean markdown code block formatting
    textOutput = textOutput
      .replace(/```json/i, "") // remove starting ```json
      .replace(/```/g, "") // remove ending ```
      .trim(); // remove extra spaces/newlines

    console.log("Cleaned Gemini Text Output:", textOutput);
    
    const aiOutput = JSON.parse(textOutput)
    console.log("Parsed AI Output:", aiOutput);

    // Merge with output template
    const finalOutput = { ...outputTemplate, ...aiOutput };

    console.log("AI Summary Output:", JSON.stringify(finalOutput, null, 2));
    return finalOutput;
  } catch (err) {
    console.error("Error generating AI summary:", err);
    throw err;
  }
}

module.exports = { generateAISummary };
