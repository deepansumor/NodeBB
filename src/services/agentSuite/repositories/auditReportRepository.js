const MongoConnection = require('../utils/mongoConnection');

class AuditReportRepository {
  constructor() {
    this.connection = new MongoConnection();
    this.collectionName = "pdp_reports";
  }

  /**
   * Create a new audit report
   * @param {Object} reportData - The report data to insert
   * @returns {Promise<Object>} - The insert result
   */
  async createReport(reportData) {
    try {
      await this.connection.connect();
      const collection = this.connection.getCollection(this.collectionName);
      
      const result = await collection.insertOne({
        ...reportData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return result;
    } finally {
      await this.connection.close();
    }
  }

  /**
   * Get audit report by brand, ASIN, and date
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @param {string} date - The date in YYYY-MM-DD format
   * @returns {Promise<Object>} - The audit report or null
   */
  async getReport(brand, asin, date) {
    try {
      await this.connection.connect();
      const collection = this.connection.getCollection(this.collectionName);
      
      const report = await collection.findOne({ brand, asin, date });
      return report;
    } finally {
      await this.connection.close();
    }
  }

  /**
   * Get the latest audit report for a brand/ASIN
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @returns {Promise<Object>} - The latest audit report or null
   */
  async getLatestReport(brand, asin) {
    try {
      await this.connection.connect();
      const collection = this.connection.getCollection(this.collectionName);
      
      const report = await collection.findOne(
        { brand, asin },
        { sort: { createdAt: -1 } }
      );
      return report;
    } finally {
      await this.connection.close();
    }
  }

  /**
   * List all audit reports for a brand/ASIN combination
   * @param {string} brand - The brand name
   * @param {string} asin - The ASIN
   * @returns {Promise<Array>} - Array of audit reports
   */
  async listReports(brand, asin) {
    try {
      await this.connection.connect();
      const collection = this.connection.getCollection(this.collectionName);
      
      const reports = await collection.find(
        { brand, asin },
        { sort: { createdAt: -1 } }
      ).toArray();
      
      return reports;
    } finally {
      await this.connection.close();
    }
  }
}

module.exports = AuditReportRepository;