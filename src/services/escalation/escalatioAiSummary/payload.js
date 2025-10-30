// payload.js
module.exports = function buildGeminiPayload(prompt) {
  return {
    model: "gemini-2.0-flash",
    contents: prompt,
//    prompt,
  };
};
