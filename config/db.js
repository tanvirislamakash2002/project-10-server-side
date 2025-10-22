const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
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
module.exports = connectDB;
module.exports.client = client;