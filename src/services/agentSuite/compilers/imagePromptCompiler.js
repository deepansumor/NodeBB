const fs = require("fs");
const path = require("path");

class ImagePromptCompiler {
  constructor() {
    this.templatePath = path.join(
      __dirname,
      "../prompts/image_prompt.template.txt",
    );
    this.rubricPath = path.join(__dirname, "../rubrics/image_rubric.json");
    this.outputSchemaPath = path.join(
      __dirname,
      "../output_templates/image_output.json",
    );
  }

  /**
   * Compile the image prompt with input data and rubric
   * @param {Object} inputs - The inputs containing images data
   * @returns {string} - The compiled prompt
   */
  compile(inputs) {
    try {
      // Load template and rubric
      const template = fs.readFileSync(this.templatePath, "utf8");
      const rubric = JSON.parse(fs.readFileSync(this.rubricPath, "utf8"));
      const outputSchema = fs.readFileSync(this.outputSchemaPath, "utf8");
      // Format images as a readable list
      const imagesText = inputs.images
        ? inputs.images
            .map((image, index) => `${index + 1}. ${image}`)
            .join("\n")
        : "";

      // Replace template variables
      let compiledPrompt = template
        .replace("{{input.images}}", imagesText)
        .replace(
          "{{rubric_data:image_stack_quality_rubric.json}}",
          JSON.stringify(rubric, null, 2),
        )
        .replace("{{output_schema:image_stack_quality.json}}", outputSchema);

      return compiledPrompt;
    } catch (error) {
      throw new Error(`Failed to compile image prompt: ${error.message}`);
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

    if (!inputs.images || !Array.isArray(inputs.images)) {
      throw new Error("Images is required and must be an array");
    }

    if (inputs.images.length === 0) {
      throw new Error("At least one image URL is required");
    }

    return true;
  }
}

module.exports = ImagePromptCompiler;
