import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import path from "path"
import  { connectDB, client } from '../config/db.js'
import { userRoutes } from "./modules/user/user.routes.js"
import { authRoutes } from "./modules/auth/auth.routes.js"
import { blogRoutes } from "./modules/blog/blog.routes.js"
import { favoriteRoutes } from "./modules/favorite/favorite.routes.js"
import { imageRoutes } from "./modules/image/image.routes.js"

dotenv.config({ path: path.join(process.cwd(), ".env") })
const app = express()

app.use(cors())
app.use(express.json())





async function run() {
    try {

        await connectDB();

        const db = client.db('ph-a10-DB')
        const listingCollection = db.collection('listings')
        // Role routes 
        app.set('db', db);

        // app.use('/api/users', roleRoutes);

        //auth routes
        app.use('/', authRoutes);

        // users routes
        app.use('/', userRoutes);

        // blog routes
        app.use('/', blogRoutes);

        // save to favorite routes
        app.use('/', favoriteRoutes);

        // image upload route
        app.use('/', imageRoutes);

        //----
        // app.post('/add-roommate', async (req, res) => {
        //     const newRoommate = req.body;
        //     const result = await listingCollection.insertOne(newRoommate)
        //     res.send(result)
        // })

        // app.get('/add-roommate', async (req, res) => {
        //     const result = await listingCollection.find().toArray()
        //     res.send(result)
        // })

        // app.get('/home', async (req, res) => {
        //     const result = await listingCollection.find({ availability: 'yes' }).limit(6).toArray()
        //     res.send(result)
        // })

        // app.get('/add-roommate/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await listingCollection.findOne(query)
        //     res.send(result)
        // })

        // app.put('/add-roommate/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true }
        //     const updatedData = req.body;
        //     const updatedDoc = {
        //         $set: updatedData
        //     }
        //     const result = await listingCollection.updateOne(filter, updatedDoc, options)

        //     res.send(result)
        // })

        // app.delete('/add-roommate/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await listingCollection.deleteOne(query);
        //     res.send(result)
        // })


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

export default app;