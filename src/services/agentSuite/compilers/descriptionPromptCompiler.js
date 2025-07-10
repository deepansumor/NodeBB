const fs = require("fs");
const path = require("path");

class DescriptionPromptCompiler {
  constructor() {
    this.templatePath = path.join(
      __dirname,
      "../prompts/description_prompt.template.txt",
    );
    (this.rubricPath = path.join(
      __dirname,
      "../rubrics/description_rubric.json",
    )),
      (this.outputSchemaPath = path.join(
        __dirname,
        "../output_templates/description_output.json",
      ));
  }

  /**
   * Compile the description prompt with input data and rubric
   * @param {Object} inputs - The inputs containing description data
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
        .replace("{{input.description}}", inputs.description || "")
        .replace(
          "{{rubric_data:product_description_rubric.json}}",
          JSON.stringify(rubric, null, 2),
        )
        .replace("{{output_schema:product_description.json}}", outputSchema);
      return compiledPrompt;
    } catch (error) {
      throw new Error(`Failed to compile description prompt: ${error.message}`);
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

    if (!inputs.description || typeof inputs.description !== "string") {
      throw new Error("Description is required and must be a string");
    }

    return true;
  }
}

module.exports = DescriptionPromptCompiler;
