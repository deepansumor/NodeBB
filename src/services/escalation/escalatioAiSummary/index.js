// index.js
const { escalationSummaryPrompt } = require("./prompts/escalationSummary");
const { remarkSummaryPrompt } = require("./prompts/remarkSummary");
const buildGeminiPayload = require("./payload");
const outputTemplate = require("./schema");
const { geminiClient } = require("../../gemini/geminiClient");
const { uploadToS3 } = require("../../../services/aws-s3");
const fs = require("fs");
const path = require("path");

// Step 1: Read mock data
// const mockData = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "./escalationData.json"), "utf-8")
// );
// console.log("Mock Data Loaded:", mockData);

// Step 2: Generate AI summary

async function generateAISummary(escalationsData, bucketName, file, type = "escalation") {
  try {
    const uploadedFiles = [];

    for (const brand of escalationsData) {
      console.log(`\n🧠 Generating summary for brand: ${brand.brandName}`);

      // 🔹 Detect whether to use escalation or remark structure
      const brandDataText = `
Brand: ${brand.brandName}
Date: ${brand.date}
BrandId: ${brand.brandId}
Total Escalations: ${brand.totalEscalations}

${brand.escalations
          .map(e => {
            if (type === "remark") {
              return `Portfolio: ${e.portfolioName}
Post Content: ${typeof e.postContent === "object" ? JSON.stringify(e.postContent) : e.postContent}
Resolved At: ${e.resolvedAt}`;
            } else {
              return `Portfolio: ${e.portfolioName}
Summary: ${e.summary}`;
            }
          })
          .join("\n\n")}
`;

      // 🔹 Choose prompt dynamically
      const prompt =
        type === "remark"
          ? remarkSummaryPrompt(brandDataText)
          : escalationSummaryPrompt(brandDataText);

      console.log("Generated Prompt:\n", prompt);

      const payload = buildGeminiPayload(prompt);
      console.log("Gemini Payload Built:", payload);

      const response = await geminiClient.generateContent(payload);
      console.log("Gemini Response Received:", response);

      let textOutput =
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      textOutput = textOutput
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/(\n|{|,)\s*([a-zA-Z0-9_]+)\s*:/g, '$1 "$2":')
        .trim();

      console.log("Cleaned Gemini Text Output:", textOutput);

      const aiOutput = JSON.parse(textOutput);
      console.log("Parsed AI Output JSON:", aiOutput);

      const finalOutput = { brandName: brand.brandName, ...aiOutput };
      console.log("Final Output Object:", finalOutput);

      const date = new Date();
      date.setDate(date.getDate() - 1);
      const dateStr = date.toISOString().split('T')[0];
      const key = `emsAiSummary/${brand.brandId}/${dateStr}/${file}`;

      const fileData = JSON.stringify(finalOutput, null, 2);
      console.log("Prepared File Data for Upload:", fileData);


      const result = await uploadToS3(bucketName, key, fileData);
      console.log(`✅ File uploaded for ${brand.brandName}:`, result.Location);

      uploadedFiles.push({
        brandName: brand.brandName,
        brandId: brand.brandId,
        url: result.Location,
      });
    }

    console.log("\n🎯 All brand summaries generated and uploaded successfully!");
    return uploadedFiles;

  } catch (err) {
    console.error("Error generating AI summary:", err);
    throw err;
  }
}



module.exports = { generateAISummary };
