const axios = require("axios");
const ImagePromptCompiler = require("../compilers/imagePromptCompiler");
const nconf = require("nconf");
const Gemini = nconf.get("gemini")
class ImageAgent {
  constructor() {
    this.compiler = new ImagePromptCompiler();
    this.apiKey = Gemini.api_key;

    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
  }

  /**
   * Execute the image agent analysis
   * @param {Object} inputs - The inputs containing images data
   * @returns {Promise<Object>} - The analysis result
   */
  async execute(inputs) {
    try {
      // Validate inputs
      this.compiler.validate(inputs);

      // Compile the prompt
      const prompt = this.compiler.compile(inputs);

      // Call Gemini API
      const response = await this.callGeminiAPI(prompt, inputs);

      // Parse and validate response
      const result = this.parseResponse(response);

      // Add timestamp
      result.timestamp = new Date().toISOString();

      return result;
    } catch (error) {
      throw new Error(`ImageAgent execution failed: ${error.message}`);
    }
  }

  /**
   * Call the Gemini API with the compiled prompt and images
   * @param {string} prompt - The compiled prompt
   * @param {Object} inputs - The inputs containing image URLs
   * @returns {Promise<string>} - The API response
   */
  async callGeminiAPI(prompt, inputs) {
    try {
      // Start with the text prompt
      const parts = [{ text: prompt }];

      // Download and encode images if available
      if (inputs.images && Array.isArray(inputs.images)) {
        for (let i = 0; i < inputs.images.length; i++) {
          const imageUrl = inputs.images[i];
          try {
            console.log(`📷 Downloading image ${i + 1}: ${imageUrl}`);
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
              timeout: 10000,
            });

            const base64Image = Buffer.from(imageResponse.data).toString(
              "base64",
            );

            parts.push({
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            });

            console.log(`✓ Image ${i + 1} encoded successfully`);
          } catch (imageError) {
            console.warn(
              `⚠️ Failed to download image ${i + 1} from ${imageUrl}: ${imageError.message}`,
            );
            // Continue with other images
          }
        }
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: parts,
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

module.exports = ImageAgent;
