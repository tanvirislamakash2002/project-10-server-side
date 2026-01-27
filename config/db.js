import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb://localhost:27017`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const connectDB = async () => {
  try {
    // await client.connect();
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

export { client, connectDB };