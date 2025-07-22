const fs = require("fs");
const path = require("path");

class TitlePromptCompiler {
  constructor() {
    this.templatePath = path.join(
      __dirname,
      "../prompts/title_prompt.template.txt",
    );
    this.rubricPath = path.join(__dirname, "../rubrics/title_rubric.json");
    this.outputSchemaPath = path.join(
      __dirname,
      "../output_templates/title_output.json",
    );
  }

  /**
   * Compile the title prompt with input data and rubric
   * @param {Object} inputs - The inputs containing title data
   * @returns {string} - The compiled prompt
   */
  compile(inputs) {
    try {
      // Load template and rubric
      const template = fs.readFileSync(this.templatePath, "utf8");
      const rubric = JSON.parse(fs.readFileSync(this.rubricPath, "utf8"));
      const outputSchema = fs.readFileSync(this.outputSchemaPath, "utf8");
      // Replace template variables
      let compiledPrompt = template
        .replace("{{inputs.title}}", inputs.title || "")
        .replace(
          "{{rubric_data:title_optimization_rubric.json}}",
          JSON.stringify(rubric, null, 2),
        )
        .replace("{{output_schema:title_optimization.json}}", outputSchema);

      return compiledPrompt;
    } catch (error) {
      throw new Error(`Failed to compile title prompt: ${error.message}`);
    }
  }

  /**
   * Validate that required inputs are present
   * @param {Object} inputs - The inputs to validate
   * @returns {boolean} - True if valid
   */
  validate(inputs) {
    if (!inputs || typeof inputs !== "object") {
      throw new Error("Inputs must be an object");
    }

    if (!inputs.title || typeof inputs.title !== "string") {
      throw new Error("Title is required and must be a string");
    }

    return true;
  }
}

module.exports = TitlePromptCompiler;
