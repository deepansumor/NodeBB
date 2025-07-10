const axios = require("axios");
const DescriptionPromptCompiler = require("../compilers/descriptionPromptCompiler");
const nconf = require("nconf");
const Gemini = nconf.get("gemini")

class DescriptionAgent {
  constructor() {
    this.compiler = new DescriptionPromptCompiler();
    this.apiKey = Gemini.api_key;

    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
  }

  /**
   * Execute the description agent analysis
   * @param {Object} inputs - The inputs containing description data
   * @returns {Promise<Object>} - The analysis result
   */
  async execute(inputs) {
    try {
      // Validate inputs
      this.compiler.validate(inputs);

      // Compile the prompt
      const prompt = this.compiler.compile(inputs);

      // Call Gemini API
      const response = await this.callGeminiAPI(prompt);

      // Parse and validate response
      const result = this.parseResponse(response);

      // Add timestamp
      result.timestamp = new Date().toISOString();

      return result;
    } catch (error) {
      throw new Error(`DescriptionAgent execution failed: ${error.message}`);
    }
  }

  /**
   * Call the Gemini API with the compiled prompt
   * @param {string} prompt - The compiled prompt
   * @returns {Promise<string>} - The API response
   */
  async callGeminiAPI(prompt) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (
        !response.data ||
        !response.data.candidates ||
        !response.data.candidates[0]
      ) {
        throw new Error("Invalid response from Gemini API");
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Gemini API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error(`Failed to call Gemini API: ${error.message}`);
    }
  }

  /**
   * Parse and validate the API response
   * @param {string} response - The raw API response
   * @returns {Object} - The parsed result
   */
  parseResponse(response) {
    try {
      // Extract JSON from response (handle potential markdown formatting)
      let jsonStr = response.trim();

      // Remove markdown code blocks if present
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/, "").replace(/\n?```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```\n?/, "").replace(/\n?```$/, "");
      }

      const result = JSON.parse(jsonStr);

      if (
        typeof result.overall_score !== "number" ||
        result.overall_score < 0 ||
        result.overall_score > 10
      ) {
        throw new Error("Invalid overall_score in response");
      }

      if (!result || typeof result !== "object") {
        throw new Error("Invalid result in response");
      }

      return result;
    } catch (error) {
      throw new Error(
        `Failed to parse API response: ${error.message}. Response: ${response}`,
      );
    }
  }
}

module.exports = DescriptionAgent;
