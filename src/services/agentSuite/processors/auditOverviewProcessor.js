const fs = require('fs');
const path = require('path');

class AuditOverviewProcessor {
  /**
   * Load weights from config file
   * @returns {Object} - Weights configuration
   */
  static loadWeights() {
    try {
      const weightsPath = path.join(__dirname, '..', 'config', 'weights.json');
      const weightsData = fs.readFileSync(weightsPath, 'utf8');
      const weights = JSON.parse(weightsData);
      
      // Convert to percentages for display
      const weightPercentages = {};
      Object.entries(weights).forEach(([key, value]) => {
        weightPercentages[key] = value * 100;
      });
      
      return weightPercentages;
    } catch (error) {
      console.error('Error loading weights config:', error);
      // Fallback weights
      return {
        title: 25,
        bulletPoint: 25,
        description: 25,
        image: 25,
      };
    }
  }

  /**
   * Calculate overall audit overview
   * @param {Object} agentResults - All agent results
   * @returns {Object} - Audit overview with weighted scores
   */
  static calculateAuditOverview(agentResults) {
    const weights = this.loadWeights();

    let totalWeightedScore = 0;
    let totalWeight = 0;
    const categories = {};

    // && result.overall_score
    Object.entries(agentResults).forEach(([agentType, result]) => {
      if (result && weights[agentType]) {
        const score = result.overall_score;
        const weightPercent = weights[agentType];
        const weightFraction = weightPercent / 100;
        
        totalWeightedScore += score * weightFraction;
        totalWeight += weightFraction;
        
        categories[AuditOverviewProcessor.mapAgentToCategory(agentType)] = {
          score: score,
          weight_percent: weightPercent
        };
      }
    });

    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    return {
      overall_score: Math.round(overallScore * 100) / 100,
      categories: categories
    };
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

module.exports = AuditOverviewProcessor;