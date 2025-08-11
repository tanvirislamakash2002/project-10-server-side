const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const roommateCollection = client.db('ph-a10-DB').collection('roommate')

    app.post('/add-roommate', async(req, res)=>{
        const newRoommate= req.body;
         const result = await roommateCollection.insertOne(newRoommate)
        res.send(result)
    })

    app.get('/add-roommate', async(req, res)=>{
        const result = await roommateCollection.find().toArray()
        res.send(result)
    })

    app.get('/home', async(req, res)=>{
      const result = await roommateCollection.find({availability:'yes'}).limit(6).toArray()
      res.send(result)
    })

    app.get('/add-roommate/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await roommateCollection.findOne(query)
        res.send(result)
    })

    app.put('/add-roommate/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updatedData = req.body;
      const updatedDoc = {
        $set:updatedData
      }
      const result = await roommateCollection.updateOne(filter, updatedDoc, options)

      res.send(result)
    })

    app.delete('/add-roommate/:id', async(req, res)=>{
        const id  = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await roommateCollection.deleteOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is running ok')
})

app.listen(port, () => {
  console.log(`ph server is on the go ${port}`)
})
