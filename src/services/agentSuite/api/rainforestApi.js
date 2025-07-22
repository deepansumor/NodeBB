const axios = require('axios');
const COLLECTION = require('../../../database/mongo/collections');
const nconf = require("nconf");
const Rainforest = nconf.get("rainforest")
class RainforestAPI {
  constructor() {
    this.api_key = process.env.RAINFOREST_API_KEY || Rainforest.api_key;
    this.url = process.env.RAINFOREST_URL || 'https://api.rainforestapi.com';
    
    if (!this.api_key) {
      console.warn('⚠️ RAINFOREST_API_KEY not found in environment variables');
    }
  }

  /**
   * Fetch fresh product data from Rainforest API
   * @param {string} asin - The ASIN to fetch data for
   * @returns {Promise<Object>} - Object containing data and metadata
   */
  async fetchProductData(asin) {
    try {
      if (!this.api_key) {
        throw new Error('Rainforest API key not configured');
      }

      console.log(`📡 Fetching product data for ASIN: ${asin}`,this.api_key);
      
      const url = `${this.url}/request?api_key=${this.api_key}&amazon_domain=amazon.in&asin=${asin}&type=product&language=en_US&currency=inr`;
      const response = await axios.get(url);
      
      // Extract product data from response
      const product = response.data.product;
      
      if (!product) {
        throw new Error(`No product data found for ASIN: ${asin}`);
      }

      // Parse images and bullet points
      const images = product.images_flat ? product.images_flat.split(",") : [];
      const bullet_points = product.feature_bullets_flat ? product.feature_bullets_flat.split('. ') : [];

      // Structure the data for our system
      const data = {
        title: product.title || '',
        images: images,
        bullet_points: bullet_points,
        description: product.description || ''
      };

      // Create current date
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // Structure metadata
      const metaData = {
        brand: product.brand || 'Unknown',
        asin: asin,
        date: formattedDate,
        last_updated: new Date().toISOString(),
        source: 'rainforest_api'
      };

      // Structure product data for storage
      const productData = {
        asin: asin,
        brand: product.brand || 'Unknown',
        link: product.link || '',
        data: data,
        date: formattedDate,
        last_updated: new Date().toISOString()
      };

      console.log(`✅ Successfully fetched data for ${asin} - Brand: ${metaData.brand}`);
      const saveData = {
        data,
        brand: product.brand || 'Unknown',
        asin: asin,
        date: formattedDate,
      }
      await db.setObject(`product:${asin}`,saveData,COLLECTION.ASINS);
      return { 
        data: data, 
        metaData: metaData,
        productData: productData 
      };

    } catch (error) {
      console.error(`❌ Error fetching data from Rainforest API for ${asin}:`, error.message);
      throw error;
    }
  }

  /**
   * Check if API is configured and available
   * @returns {boolean} - True if API is available
   */
  isAvailable() {
    return Boolean(this.api_key);
  }
}

module.exports = RainforestAPI;