import { MongoClient, ServerApiVersion } from 'mongodb';
import config from './index.js';
const uri = config.mongodb_uri;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDB = async () => {
  try {
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error(err);
  }
};

export { client, connectDB };