// remarkSummaryPrompt.js
module.exports = {
  remarkSummaryPrompt: (remarks) => `
You are an AI assistant that summarizes resolution remarks provided by team POCs.

Here are multiple remarks related to resolved escalations:
${remarks}

Summarize the key insights in under 150 words:
- What common actions were taken to resolve issues?
- How did these actions help in resolving the problems?
- What patterns or improvements are visible across teams?
- What is the overall tone or attitude shown by the teams?

Now, provide short and clear recommendations (as actionable points):
- What can teams continue doing to maintain effective resolutions?
- What can be improved for faster or better outcomes?
- Any process or communication improvements noticed?

Your response must be ONLY valid JSON.
❌ Do NOT use markdown, code blocks, or backticks.
❌ Do NOT add explanations or extra text.

Return exactly this format (note: do not add \`\`\`json in starting and commas after the last key):
{
  "overview": "A detailed summary of how issues were resolved...",
  "recommendations": [
    "Actionable point 1 based on remark analysis",
    "Actionable point 2 highlighting team improvement",
    "Actionable point 3 for better resolution practices"
  ]
}
`
};
