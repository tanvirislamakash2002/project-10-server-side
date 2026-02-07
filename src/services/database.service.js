import { client } from "../../config/db.js";

class DatabaseService {
    constructor() {
        this.client = client;
        this.dbName = 'ph-a10-DB';
    }

    // get database instance
    getDatabase() {
        return this.client.db(this.dbName)
    }

    // get collection by name
    getCollection(collectionName) {
        return this.getDatabase().collection(collectionName)
    }

    // specific collection getters
    get listings() {
        return this.getCollection('listings')
    }

    get applications() {
        return this.getCollection('applications')
    }

    get blogPosts() {
        return this.getCollection('blogPosts')
    }

    get newsletterSubscriptions() {
        return this.getCollection('newsletterSubscriptions')
    }

    // for developer
    get users() {
        return this.getCollection('users')
    }
}

export const dbService = new DatabaseService();