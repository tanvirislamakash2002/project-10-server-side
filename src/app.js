import express from "express"
import cors from 'cors'
import  { connectDB, client } from '../config/db.js'
import { userRoutes } from "./modules/user/user.routes.js"
import { authRoutes } from "./modules/auth/auth.routes.js"
import { blogRoutes } from "./modules/blog/blog.routes.js"
import { favoriteRoutes } from "./modules/favorite/favorite.routes.js"
import { imageRoutes } from "./modules/image/image.routes.js"
import { listingsRoutes } from "./modules/listings/listings.routes.js"

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

        // Listing routes
        app.use('/api/v1/listings', listingsRoutes);

        // blog routes
        app.use('/', blogRoutes);

        // save to favorite routes
        app.use('/', favoriteRoutes);

        // image upload route
        app.use('/', imageRoutes);


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