
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const html_to_pdf = require("html-pdf-node");

class HtmlPdfNodeGenerator {
    constructor() {
        this.templatePath = path.join(__dirname, "../templates/pdp-audit-report.hbs");
        this.registerHelpers();
    }

    /**
     * Register reusable Handlebars helpers
     */
    registerHelpers() {
        handlebars.registerHelper('capitalize', (str) =>
            typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str
        );

        handlebars.registerHelper('formatKey', (str) =>
            typeof str === 'string'
                ? str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                : str
        );

        handlebars.registerHelper('not', (value) => !value);
        handlebars.registerHelper('eq', (a, b) => a === b);
        handlebars.registerHelper('and', (...args) => {
            const options = args.pop();
            return args.every(Boolean);
        });

        handlebars.registerHelper('checkIcon', (val) =>
            val === true ? 'pass' : val === false ? 'fail' : 'warning'
        );

        handlebars.registerHelper('iconSymbol', (val) =>
            val === true ? '✓' : val === false ? '✗' : '!'
        );

        handlebars.registerHelper('multiply', (a, b) => a * b);

        handlebars.registerHelper('getScoreStatus', (score) => {
            if (score >= 8) return 'excellent';
            if (score >= 6.5) return 'good';
            if (score >= 5) return 'average';
            return 'poor';
        });

        handlebars.registerHelper('criteriaSymbol', passed =>
            passed === true ? '✓' : passed === false ? '✗' : '!'
        );

        handlebars.registerHelper('getCriteriaStatus', passed =>
            passed === true ? 'pass' : passed === false ? 'fail' : 'warning'
        );
    }

    /**
     * Transform raw audit data from MongoDB into a template-friendly format
     */
    transformAuditData(raw) {
        console.log("raw data", raw)
        const CATEGORY_NAME_MAP = {
            title_optimization: "Title Optimization",
            image_stack_quality: "Image Stack Quality",
            bullet_points: "Bullet Points",
            product_description: "Product Description"
        };

        const CATEGORY_REPORT_MAP = {
            title_optimization: "title",
            image_stack_quality: "image",
            bullet_points: "bulletPoint",
            product_description: "description"
        };

        const overview = raw.audit_overview || raw.reports?.audit_overview;
        if (!overview || !overview.categories) {
            throw new Error('Missing audit_overview.categories in auditData');
        }

        const categories = Object.entries(overview.categories).map(([key, meta]) => {
            const reportKey = CATEGORY_REPORT_MAP[key] || key;

            const subcategoryObj = raw.reports?.[reportKey] || {};

            let subcategories = [];
            console.log("are the suggestion are here -->", subcategoryObj)
            subcategories.push(subcategoryObj.suggestions)
            // Proceed only if it's a valid object
            if (subcategoryObj && typeof subcategoryObj === 'object') {


                subcategories = Object.entries(subcategoryObj)
                    .filter(([k]) => k !== 'overall_score' && k !== 'timestamp')
                    .map(([subKey, subData]) => {
                        const criteria = Object.entries(subData.checklist || {}).map(([critKey, passed]) => ({
                            name: critKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            passed
                        }));

                        let suggestion = {};
                        let count =0;
                        if (subKey == "suggestions") {
                            suggestion = subData;
                            for (const key in subData) {
                                if (Array.isArray(subData[key])) {
                                   count ===0 ? suggestion={} :suggestion;
                                    subData[key].forEach(item => {
                                        suggestion[`suggestion_${count}`] = item;
                                        count++;// or = null; or = "" depending on your need
                                    });
                                }

                            }
                        }
                        return {
                            name: subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            score: subData.score,
                            notes: subData.comment,
                            criteria,
                            suggestions: suggestion

                        };
                    });
            }
            console.log("sub category --------<>", subcategories)
            // Always include the category even if subcategories are empty
            return {
                name: CATEGORY_NAME_MAP[key] || key,
                weight: `${meta.weight_percent}%`,
                score: meta.score,
                subcategories

            };
        });

        const priority_issues = (raw.priority_issues || []).map(issue => ({
            category: CATEGORY_NAME_MAP[issue.category] || issue.category,
            subcategory: issue.subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: issue.score,
            issue: issue.issue,
            severity: issue.severity
        }));

        // console.log("categories from the pdf --->",categories)

        return {
            brand: raw.brand,
            asin: raw.asin,
            lastUpdated: raw.date,
            overallScore: Math.round(overview.overall_score * 10),
            categories,
            priority_issues
        };
    }


    /**
     * Read and compile HTML template
     * @param {Object} auditData - JSON data to inject into HTML
     * @returns {string} - Final HTML content
     */
    async generateHtml(auditData) {
        const source = fs.readFileSync(this.templatePath, "utf8");
        const template = handlebars.compile(source);
        const formattedData = this.transformAuditData(auditData);
        return template(formattedData);
    }

    /**
     * Generate a PDF buffer from HTML using html-pdf-node
     * @param {Object} auditData - Structured JSON audit data
     * @returns {Promise<Buffer>} - Generated PDF
     */
    async generatePdf(auditData) {
        const html = await this.generateHtml(auditData);
        const file = { content: html };

        const pdfBuffer = await html_to_pdf.generatePdf(file, {
            format: "A4",
            printBackground: true,
            margin: { top: 20, bottom: 20, left: 15, right: 15 }
        });

        return pdfBuffer;
    }
}

module.exports = HtmlPdfNodeGenerator;