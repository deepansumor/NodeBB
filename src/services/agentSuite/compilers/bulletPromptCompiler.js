const fs = require("fs");
const path = require("path");

class BulletPromptCompiler {
  constructor() {
    this.templatePath = path.join(
      __dirname,
      "../prompts/bullet_prompt.template.txt",
    );
    this.rubricPath = path.join(
      __dirname,
      "../rubrics/bullet_points_rubric.json",
    );
    this.outputSchemaPath = path.join(
      __dirname,
      "../output_templates/bullet_points_output.json",
    );
  }

  /**
   * Compile the bullet point prompt with input data and rubric
   * @param {Object} inputs - The inputs containing bullets data
   * @returns {string} - The compiled prompt
   */
  compile(inputs) {
    try {
      // Load template and rubric
      const template = fs.readFileSync(this.templatePath, "utf8");
      const rubric = JSON.parse(fs.readFileSync(this.rubricPath, "utf8"));
      const outputSchema = fs.readFileSync(this.outputSchemaPath, "utf8");

      // Format bullets as a readable list
      const bulletsText = inputs.bullet_points
        ? inputs.bullet_points
            .map((bullet, index) => `${index + 1}. ${bullet}`)
            .join("\n")
        : "";

      // Replace template variables
      let compiledPrompt = template
        .replace("{{input.bullet_points}}", bulletsText)
        .replace(
          "{{rubric_data:bullet_points_rubric.json}}",
          JSON.stringify(rubric, null, 2),
        )
        .replace("{{output_schema:bullet_points.json}}", outputSchema);
      return compiledPrompt;
    } catch (error) {
      throw new Error(`Failed to compile bullet prompt: ${error.message}`);
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

    if (!inputs.bullet_points || !Array.isArray(inputs.bullet_points)) {
      throw new Error("Bullets is required and must be an array");
    }

    if (inputs.bullet_points.length === 0) {
      throw new Error("At least one bullet point is required");
    }

    return true;
  }
}

module.exports = BulletPromptCompiler;
