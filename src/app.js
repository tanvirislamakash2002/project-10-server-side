import express from "express"
import cors from 'cors'
import  { connectDB, client } from '../config/db.js'
import { userRoutes } from "./modules/user/user.routes.js"
import { authRoutes } from "./modules/auth/auth.routes.js"
import { blogRoutes } from "./modules/blog/blog.routes.js"
import { favoriteRoutes } from "./modules/favorite/favorite.routes.js"
import { imageRoutes } from "./modules/image/image.routes.js"
import { listingsRoutes } from "./modules/listings/listings.routes.js"
import { roleRoutes } from "./ForDeveloper/roleRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

async function run() {
    try {

        await connectDB();

        // Role routes 
        app.use('/api/v1/users', roleRoutes);

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


    } catch(err) {
        console.log(err);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running ok')
})

export default app;