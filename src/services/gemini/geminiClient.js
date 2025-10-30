// /config/geminiClient.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nconf = require("nconf");
const Gemini = nconf.get("gemini")


const genAI = new GoogleGenerativeAI(Gemini.api_key);

// Create a wrapper for generating content
const geminiClient = {
  generateContent: async (payload) => {
    try {
      const model = genAI.getGenerativeModel({ model: payload.model });
      const result = await model.generateContent(payload.contents);
      return result;
    } catch (err) {
      console.error("Gemini API Error:", err);
      throw err;
    }
  }
};

module.exports = { geminiClient };
