const AuditReportRepository = require('../repositories/auditReportRepository');
const PriorityIssuesProcessor = require('../processors/priorityIssuesProcessor');
const AuditOverviewProcessor = require('../processors/auditOverviewProcessor');

class AuditDataRepository {
  constructor() {
    this.repository = new AuditReportRepository();
  }

  /**
   * Create or update a consolidated audit report
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @param {string} date - The date in YYYY-MM-DD format
   * @param {Object} agentResults - Object containing all agent results (cleaned output data)
   * @param {Object} metadata - The product metadata
   * @param {Object} fullResults - Full orchestrator results with scores (optional)
   * @returns {Promise<Object>} - The insert/update result
   */
  async createAuditReport(brand, asin, date, agentResults, metadata, fullResults = null) {
    try {
      const priorityIssues = PriorityIssuesProcessor.extractPriorityIssues(agentResults);
      // Use full orchestrator results for audit overview if available, otherwise fall back to clean results
      const auditOverview = AuditOverviewProcessor.calculateAuditOverview(fullResults || agentResults);
      const month = date?.slice?.(0, 7);  // "YYYY-MM"
      const _key =`asin:${asin.trim()}:month:${month.trim()}`;
      const consolidatedReport = {
        _key,
        brand,
        asin,
        date,
        reports: {
          ...agentResults,
          priority_issues: priorityIssues,
          audit_overview: auditOverview
        }
      };

      const result = await this.repository.createReport(consolidatedReport);
      console.log(`Audit report created for ${brand}/${asin}/${date} with ID: ${result.insertedId}`);

      return consolidatedReport;

    } catch (error) {
      console.error("Error creating/updating audit report:", error);
      throw error;
    }
  }

  /**
   * Retrieve audit report by brand, ASIN, and date
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @param {string} date - The date in YYYY-MM-DD format
   * @returns {Promise<Object>} - The audit report or null if not found
   */
  async getAuditReport(brand, asin, date) {
    return await this.repository.getReport(brand, asin, date);
  }

  /**
   * List all audit reports for a brand/ASIN combination
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @returns {Promise<Array>} - Array of audit reports
   */
  async listAuditReports(brand, asin) {
    return await this.repository.listReports(brand, asin);
  }

  /**
   * Get the latest audit report for a brand/ASIN
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @returns {Promise<Object>} - The latest audit report or null
   */
  async getLatestAuditReport(brand, asin) {
    return await this.repository.getLatestReport(brand, asin);
  }
}

module.exports = AuditDataRepository;