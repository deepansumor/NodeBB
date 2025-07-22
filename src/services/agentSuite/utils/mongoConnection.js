const { MongoClient } = require("mongodb");
const nconf = require("nconf")
const MONGODB = nconf.get("mongo")
class MongoConnection {
  constructor() {
    this.client = null;
    this.db = null;
    this.connectionString = MONGODB.uri;
    this.dbName = "test";
  }

  async connect() {
    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log("Connected to MongoDB successfully");
      return this.db;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async close() {
    if (this.client && this.client.topology && !this.client.topology.closed) {
      await this.client.close();
      console.log("MongoDB connection closed");
    }
  }

  getCollection(collectionName) {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db.collection(collectionName);
  }
}

module.exports = MongoConnection;