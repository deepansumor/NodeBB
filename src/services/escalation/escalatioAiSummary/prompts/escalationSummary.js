// prompt.js
module.exports = {
  escalationSummaryPrompt: (escalations) => `
You are an AI assistant that summarizes escalation reports.

Here are multiple escalation updates across portfolios:
${escalations}

Summarize the key points in under 150 words:
- What issues are recurring?
- Which portfolios are most impacted?
- Any trends or patterns?
- What is the overall status and mood?

Now, provide clear and actionable recommendations (in short phrases):
- What possible changes can resolve the issues?
- How can these changes improve portfolio performance?
- What are the key action pointers to boost results?

Your response must be ONLY valid JSON.
❌ Do NOT use markdown, code blocks, or backticks.
❌ Do NOT add explanations or extra text.

Return exactly this format (note: do not add \`\`\`json in starting and commas after the last key):
{
  "overview": "A detailed summary...",
    "recommendations": [
    "Short actionable point 1",
    "Short actionable point 2",
    "Short actionable point 3"
  ]
}
`
};
