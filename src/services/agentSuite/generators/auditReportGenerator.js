const HtmlPdfNodeGenerator = require('./htmlPdfNodeGenerator');
const s3Api = require('../api/s3Api');

class AuditReportGenerator {
  constructor() {
    this.htmlPdfGenerator = new HtmlPdfNodeGenerator();
    console.log('📄 Audit report generator (HTML-based) initialized');
  }

  /**
   * Generate PDF report using Handlebars + html-pdf-node
   * @param {Object} auditData - Structured audit data
   * @returns {Promise<Buffer>} - PDF buffer
   */
  async generatePdfReport(auditData) {
    try {
      const buffer = await this.htmlPdfGenerator.generatePdf(auditData);
      console.log('✅ PDF generated using HTML template');
      return buffer;
    } catch (error) {
      console.error('❌ Failed to generate PDF:', error);
      throw error;
    }
  }

  /**
   * Generate and upload PDF to S3
   */
  async generateReport(auditData) {
    try {
      console.log(`📄 Generating PDF report for ${auditData.brand}/${auditData.asin}`);

      const pdfBuffer = await this.generatePdfReport(auditData);
      const pdfS3Key = `pdp_audit/${auditData.brand}/${auditData.asin}/${auditData.date}/audit_report.pdf`;

      await s3Api.savePdf(pdfS3Key, pdfBuffer);

      console.log(`✅ PDF uploaded to S3 at: ${pdfS3Key}`);

      return {
        success: true,
        pdfGenerated: true,
        s3Uploaded: true,
        s3Key: pdfS3Key,
      };
    } catch (error) {
      console.error('❌ Failed to generate/upload PDF report:', error);
      throw error;
    }
  }

  /**
   * Generate report from MongoDB using ASIN and date
   */
  async generateReportFromAsin(brand, asin, date = null, dataRepository) {
    try {
      const auditData = date
        ? await dataRepository.getAuditReport(brand, asin, date)
        : await dataRepository.getLatestAuditReport(brand, asin);

      if (!auditData) {
        throw new Error(`No audit data found for ${brand}/${asin}/${date || 'latest'}`);
      }

      return await this.generateReport(auditData);
    } catch (error) {
      console.error('❌ Failed to generate report from ASIN:', error);
      throw error;
    }
  }
}

module.exports = AuditReportGenerator;