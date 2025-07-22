class PriorityIssuesProcessor {
  /**
   * Extract priority issues from agent results
   * @param {Object} agentResults - All agent results
   * @returns {Array} - Array of priority issues
   */
  static extractPriorityIssues(agentResults) {
    const issues = [];

    // Check each agent result for low scores and create priority issues
    Object.entries(agentResults).forEach(([agentType, result]) => {
      if (!result || !result.overall_score) return;

      // If overall score is below 7, it's a priority issue
      if (result.overall_score < 7) {
        issues.push({
          category: PriorityIssuesProcessor.mapAgentToCategory(agentType),
          subcategory: "Overall Performance",
          issue: `Low overall score: ${result.overall_score}`,
          score: result.overall_score,
          severity: result.overall_score < 5 ? "high" : "medium",
        });
      }

      // Check individual dimensions for issues (score <= 5)
      Object.entries(result).forEach(([dimension, data]) => {
        if (typeof data === "object" && data.score !== undefined && data.score <= 5) {
          issues.push({
            category: PriorityIssuesProcessor.mapAgentToCategory(agentType),
            subcategory: dimension,
            issue: data.comment || "Low performance in this area",
            score: data.score,
            severity: data.score <= 3 ? "high" : "medium",
          });
        }
      });
    });

    return issues;
  }

  /**
   * Map agent type to category name
   * @param {string} agentType - Agent type
   * @returns {string} - Category name
   */
  static mapAgentToCategory(agentType) {
    const mapping = {
      title: "title_optimization",
      bulletPoint: "bullet_points",
      description: "product_description",
      image: "image_stack_quality",
    };
    return mapping[agentType] || agentType;
  }
}

module.exports = PriorityIssuesProcessor;