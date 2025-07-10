
const db = require("../../../database")
const COLLECTION = require("../../../database/mongo/collections")
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const services = require("../.././spapi")

// Import agents
const TitleAgent = require("../agents/titleAgent");
const BulletPointAgent = require("../agents/bulletPointAgent");
const DescriptionAgent = require("../agents/descriptionAgent");
const ImageAgent = require("../agents/imageAgent");

// Import config files
const weightsConfig = require("../config/weights.json");

// Import writers
const AuditDataRepository = require("../writers/auditDataRepository");

// Import PDF generator
const AuditReportGenerator = require("../generators/auditReportGenerator");

// Import APIs
const RainforestAPI = require("../api/rainforestApi");

class AuditOrchestrator {
  constructor() {
    this.agents = {
      title: new TitleAgent(),
      bulletPoint: new BulletPointAgent(),
      description: new DescriptionAgent(),
      image: new ImageAgent(),
    };

    this.dataRepository = new AuditDataRepository();
    this.reportGenerator = new AuditReportGenerator();
    this.rainforestAPI = new RainforestAPI();

    // Initialize AJV for schema validation
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);

    // Load schemas
    this.schemas = this.loadSchemas();
  }

  /**
   * Load all JSON schemas for validation
   * @returns {Object} - Object containing all loaded schemas
   */
  loadSchemas() {
    const schemasDir = path.join(__dirname, "../schemas");
    const schemas = {};

    try {
      schemas.title = JSON.parse(
        fs.readFileSync(
          path.join(schemasDir, "title_output.schema.json"),
          "utf8",
        ),
      );
      schemas.bulletPoint = JSON.parse(
        fs.readFileSync(
          path.join(schemasDir, "bullet_points.schema.json"),
          "utf8",
        ),
      );
      schemas.description = JSON.parse(
        fs.readFileSync(
          path.join(schemasDir, "description_output.schema.json"),
          "utf8",
        ),
      );
      schemas.image = JSON.parse(
        fs.readFileSync(
          path.join(schemasDir, "image_output.schema.json"),
          "utf8",
        ),
      );

      // Compile schemas
      for (const [key, schema] of Object.entries(schemas)) {
        schemas[key] = this.ajv.compile(schema);
      }

      console.log("All schemas loaded and compiled successfully");
      return schemas;
    } catch (error) {
      console.error("Schema loading error:", error);
      throw new Error(`Failed to load schemas: ${error.message}`);
    }
  }

  /**
   * Load product data from Rainforest API
   * @param {string} asin - The ASIN to fetch data for
   * @returns {Promise<Object>} - Object containing inputs and metadata
   */
  async loadProductData(asin) {
    try {
      if (!this.rainforestAPI.isAvailable()) {
        throw new Error(
          "Rainforest API not configured. Please provide RAINFOREST_API_KEY in environment variables.",
        );
      }

      // const result = await this.rainforestAPI.fetchProductData(asin);

      // const result = await services.fetchCatalogData(asin)

      const result = {
  "data": {
    "title": "Royal Enfield TPEX Full Face Helmet with Clear Visor Gloss White, Size: XL(61-62cm)",
    "images": [
      "https://m.media-amazon.com/images/I/411DAlYfp9L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/4184AK-Ra4S._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/31MmIlyw2VL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41F7Pgvw8VL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/413D6kdzV1L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/31dkDxSxQjL._SL1500_.jpg"
    ],
    "bullet_points": [
      "Size for the helmets would be :XS: 53-54cm, S: 55-56 cm, M: 57-58cm, L: 59-60cm, XL: 61-62cm basis head measurement. Kindly refer image size chart for details.",
      "With internationally recognised certifications like ECE, ISI and DOT, the Street Prime Border Stripe helmet will keep you safe throughout your adventures",
      "Design: Classic full face helmet with visor. Shell Construction: Outer shell made of high impact grade ABS (Acrylo Nitrile Butadiene Styrene). Impact Protection: High density 3 Piece (Head, Cheek and Chin) EPS -Expanded PolyStyrene liner for better impact absorption. Comfort: Comfort liner and polyester internals for improved performance and comfort on long rides. Durability: Both helmet painted surface and visor surface are UV treated for higher durability",
      "Certification : ECE, ISI (IS: 4151) and DOT (FMVSS No. 218) certified. Lock : Adjustable nylon chin straps with cushion for better grip and enhanced comfort. Easy to operate Micrometric lock with D-ring for locking support. Visor removal mechanism: Easy to remove twist and release mechanism. Lock: Adjustable nylon chin straps with cushion for better grip and enhanced comfort. Easy to operate Micrometric lock with D-ring for locking support",
      "Removed internals/parts shall be gently washed with light cleaning agents. Usage of Helmet spray cleaners are preferable"
    ],
    "description": "Wash Care: Removed internals / parts (if applicable) shall be gently washed with light cleaning agents. Usage of Helmet spray cleaners are preferable"
  },
  "metaData": {
    "brand": "RoyalEnfield",
    "asin": "B09FQF86KP",
    "date": "2025-07-10",
    "last_updated": "2025-07-10T10:55:32.664503Z",
    "source": "selenium_scraper"
  },
  "productData": {}
} 















      // Transform API data to match our agent input format
      const inputs = {
        title: result.data.title,
        images: result.data.images,
        bullet_points: result.data.bullet_points,
        description: result.data.description,
      };

      console.log("Product data loaded from Rainforest API");
      console.log(
        `Processing: ${result.metaData.brand} - ${result.metaData.asin}`,
      );

      return {
        inputs,
        metadata: result.metaData,
        productData: result.productData,
      };
    } catch (error) {
      throw new Error(`Failed to load product data: ${error.message}`);
    }
  }

  /**
   * Validate agent output against its schema
   * @param {string} agentType - The type of agent (title, bulletPoint, etc.)
   * @param {Object} output - The agent output to validate
   * @returns {boolean} - True if valid
   */
  validateOutput(agentType, output) {
    const validator = this.schemas[agentType];

    if (!validator) {
      throw new Error(`No schema validator found for agent type: ${agentType}`);
    }

    const isValid = validator(output);

    if (!isValid) {
      const errors = validator.errors
        .map((err) => `${err.instancePath}: ${err.message}`)
        .join(", ");
      throw new Error(`Schema validation failed for ${agentType}: ${errors}`);
    }

    console.log(`✓ ${agentType} output validated successfully`);
    return true;
  }

  /**
   * Check if agent has required input data
   * @param {string} agentType - The type of agent
   * @param {Object} inputs - The input data
   * @returns {boolean} - True if required data is present
   */
  hasRequiredInput(agentType, inputs) {
    // console.log("inputs from the rainforest -->",inputs)
    const requiredFields = {
      title: ["title"],
      bulletPoint: ["bullet_points"],
      description: ["description"],
      image: ["images"],
    };


    const fields = requiredFields[agentType];
    if (!fields) return true;

    return fields.every(
      (field) =>
        inputs[field] !== null &&
        inputs[field] !== undefined &&
        inputs[field] !== "" &&
        (!Array.isArray(inputs[field]) || inputs[field].length > 0),
    );
  }

  /**
   * Generate zero score output for skipped agents
   * @param {string} agentType - The type of agent
   * @returns {Object} - Zero score output matching the schema
   */
  generateZeroScoreOutput(agentType) {
    const baseOutput = {
      overall_score: 0,
      timestamp: new Date().toISOString(),
    };

    switch (agentType) {
      case "title":
        return {
          ...baseOutput,
          keyword_usage: {
            score: 0,
            checklist: {},
            comment: "No title data provided",
          },
          readability: {
            score: 0,
            checklist: {},
            comment: "No title data provided",
          },
          length: {
            score: 0,
            checklist: {},
            comment: "No title data provided",
          },
        };

      case "bulletPoint":
        return {
          ...baseOutput,
          formatting_scanability: {
            score: 0,
            checklist: {},
            comment: "No bullet points data provided",
          },
          value_prop_clarity: {
            score: 0,
            checklist: {},
            comment: "No bullet points data provided",
          },
        };

      case "description":
        return {
          ...baseOutput,
          formatting: {
            score: 0,
            checklist: {},
            comment: "No description data provided",
          },
          brand_narrative: {
            score: 0,
            checklist: {},
            comment: "No description data provided",
          },
        };

      case "image":
        return {
          ...baseOutput,
          main_image: {
            score: 0,
            checklist: {},
            comment: "No image data provided",
          },
          infographics: {
            score: 0,
            checklist: {},
            comment: "No image data provided",
          },
          lifestyle_use_case_images: {
            score: 0,
            checklist: {},
            comment: "No image data provided",
          },
          image_resolution: {
            score: 0,
            checklist: {},
            comment: "No image data provided",
          },
        };

      default:
        return baseOutput;
    }
  }

  /**
   * Write consolidated audit report to MongoDB
   * @param {Object} agentResults - All agent results
   * @param {Object} metadata - The metadata
   */
  async writeConsolidatedReport(agentResults, metadata) {
    try {
      const brand = metadata.brand;
      const asin = metadata.asin;
      const date = metadata.last_updated.split("T")[0]; // Extract date part

      // Extract only the output data from results
      const cleanResults = {};
      Object.entries(agentResults).forEach(([key, value]) => {
        if (value.success) {
          cleanResults[key] = value.output;
        }
      });

      const data = await this.dataRepository.createAuditReport(
        brand,
        asin,
        date,
        cleanResults,
        metadata,
      );
      console.log(
        `✓ Consolidated audit report written to MongoDB for ${brand}/${asin}/${date}`,
      );
      // data return for to get priority issues and audit_overview
      return data;
    } catch (error) {
      console.error(
        `Failed to write consolidated report to MongoDB: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Execute all agents in sequence
   * @param {string} asin - The ASIN to audit
   * @returns {Promise<Object>} - Object containing all agent results
   */
  async executeAllAgents(asin) {
    const startTime = Date.now();
    console.log("🚀 Starting Amazon PDP AI Audit Agent System");
    console.log("=".repeat(50));

    try {
      // Load product data from Rainforest API
      const { inputs, metadata } = await this.loadProductData(asin);

      console.log("inputs from the rainforest -->", inputs)
      const results = {};
      const agentTypes = ["title", "bulletPoint", "description", "image"];

      // Execute each agent sequentially
      for (const agentType of agentTypes) {
        try {
          // Check if required input data is present
          if (!this.hasRequiredInput(agentType, inputs)) {
            console.log(
              `⏭️  Skipping ${agentType} agent - no input data provided`,
            );
            console.log(`📊 Overall score: 0/10 (skipped)`);
            const zeroOutput = this.generateZeroScoreOutput(agentType);
            results[agentType] = {
              success: true,
              output: zeroOutput,
              score: 0,
            };
            continue;
          }

          console.log(`\n🤖 Executing ${agentType} agent...`);

          const agent = this.agents[agentType];
          if (!agent) {
            throw new Error(`Agent not found: ${agentType}`);
          }

          // Execute agent
          const startTime = Date.now();
          const output = await agent.execute(inputs);
          const executionTime = Date.now() - startTime;

          console.log(`⏱️  ${agentType} agent completed in ${executionTime}ms`);
          console.log(`📊 Overall score: ${output.overall_score}/10`);

          // Validate output against schema
          this.validateOutput(agentType, output);

          results[agentType] = {
            success: true,
            output: output,
            score: output.overall_score,
          };
        } catch (error) {
          console.error(`❌ ${agentType} agent failed: ${error.message}`);
          results[agentType] = {
            success: false,
            error: error.message,
            score: 0,
          };
        }
      }

      const date = metadata.date.slice(0,7);
      // Write consolidated report to MongoDB
      // await db.setObject(`asin:${asin.trim()}:month:${date.trim()}`,data,COLLECTION.REPORT)
      const data = await this.writeConsolidatedReport(results, metadata);

      // Generate PDF report and save to S3
      let pdfResult = null;
      
      try {
        console.log("\n📄 Generating PDF report...");
        const brand = metadata.brand;
        const asin = metadata.asin;
        const date = metadata.last_updated.split("T")[0]; // Extract date part

        pdfResult = await this.reportGenerator.generateReportFromAsin(
          brand,
          asin,
          date,
          this.dataRepository,
        );
        console.log(
          `✅ PDF report generated and saved to S3: ${pdfResult.s3Key}`,
        );
      } catch (pdfError) {
        console.error(`❌ Failed to generate PDF report: ${pdfError.message}`);
        // Continue with the audit completion even if PDF generation fails
      }

      const totalTime = Date.now() - startTime;
      console.log("\n" + "=".repeat(50));
      

      // Print individual scores
      console.log("\n📊 Individual Scores:");
      for (const [agentType, result] of Object.entries(results)) {
        const status = result.success ? "✓" : "❌";
        const score = result.success ? `${result.score}/10` : "FAILED";
        console.log(`  ${status} ${agentType}: ${score}`);
      }

      const rootData = {
        brand: metadata.brand,
        asin: metadata.asin,
        date: metadata.last_updated.split("T")[0]
      }
      const reports = data.reports
      return {
        success: true,
        reports,
        data:rootData,
        executionTime: totalTime,
        pdfReport: pdfResult,
      };
    } catch (error) {
      console.error(`\n❌ Orchestration failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Get consolidated audit report from MongoDB
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @param {string} date - The date in YYYY-MM-DD format (optional)
   * @returns {Promise<Object>} - The audit report or latest report
   */
  async getAuditReport(brand, asin, date = null) {
    try {
      if (date) {
        return await this.dataRepository.getAuditReport(brand, asin, date);
      } else {
        return await this.dataRepository.getLatestAuditReport(brand, asin);
      }
    } catch (error) {
      console.error(`Error retrieving audit report: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all audit reports for a brand/ASIN
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @returns {Promise<Array>} - Array of audit reports
   */
  async listAuditReports(brand, asin) {
    try {
      return await this.dataRepository.listAuditReports(brand, asin);
    } catch (error) {
      console.error(`Error listing audit reports: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate PDF report for a specific audit
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @param {string} date - The date (optional, uses latest if not provided)
   * @returns {Promise<string>} - S3 key of uploaded PDF
   */
  async generatePDFReport(brand, asin, date = null) {
    try {
      return await this.reportGenerator.generateReportFromAsin(
        brand,
        asin,
        date,
        this.dataRepository,
      );
    } catch (error) {
      console.error(`Error generating PDF report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Builds the audit_overview.json file, which summarizes the overall
   * performance of the PDP across major content categories like title,
   * image stack, bullet points, and description.
   *
   * It uses configurable weights (from config/weights.json) to calculate
   * a weighted overall score and stores individual category scores
   * and their contribution percentages.
   *
   * This overview is written to S3 and helps teams quickly assess
   * the listing's overall optimization quality at a glance.
   */

  buildAuditOverview(results) {
    const categoryMap = {
      title: "title_optimization",
      image: "image_stack_quality",
      bulletPoint: "bullet_points",
      description: "product_description",
    };

    const categories = {};
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [agentType, weight] of Object.entries(weightsConfig)) {
      const categoryKey = categoryMap[agentType];
      const result = results[agentType];
      console.log(agentType, result);

      const score =
        result && typeof result.score === "number" ? result.score : 0;
      const weightPercent = +(weight * 100).toFixed(2);

      categories[categoryKey] = {
        score,
        weight_percent: weightPercent,
      };

      weightedSum += score * weight;
      totalWeight += weight;
    }

    const overall_score = +(weightedSum / totalWeight).toFixed(2);
    console.log(overall_score, categories);
    return { overall_score, categories };
  }

  /**
   * Builds priority_issues.json from agent outputs using their nested scoring format
   * Looks for all subcategories with scores and comments.
   */
  buildPriorityIssues(results, topN = 5) {
    const issues = [];

    for (const [agentType, result] of Object.entries(results)) {
      if (!result.success) continue;

      const output = result.output;

      for (const [subcategory, rubricObj] of Object.entries(output)) {
        if (
          subcategory === "overall_score" ||
          subcategory === "timestamp" ||
          subcategory === "metadata" ||
          subcategory === "file_created_at"
        ) {
          continue; // skip meta fields
        }

        // Ensure it looks like a rubric
        if (
          !rubricObj ||
          typeof rubricObj !== "object" ||
          rubricObj.score == null
        )
          continue;

        issues.push({
          category: agentType,
          subcategory: subcategory,
          issue: rubricObj.comment || "No comment provided",
          score: rubricObj.score,
        });
      }
    }

    // Sort by score (lowest first)
    issues.sort((a, b) => a.score - b.score);

    // Take top N
    const topIssues = issues.slice(0, topN).map((item) => ({
      ...item,
      severity: item.score <= 3 ? "high" : item.score <= 6 ? "medium" : "low",
    }));

    return topIssues;
  }
}

module.exports = AuditOrchestrator;