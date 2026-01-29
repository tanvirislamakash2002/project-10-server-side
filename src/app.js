import express from "express"
import cors from 'cors'
import  { connectDB } from '../config/db.js'
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
        app.use('/api/v1/role', roleRoutes);

        //auth routes
        app.use('/api/v1/auth', authRoutes);

        // users routes
        app.use('/api/v1/user', userRoutes);

        // Listing routes
        app.use('/api/v1/listings', listingsRoutes);

        // blog routes
        app.use('/api/v1/blog', blogRoutes);

        // save to favorite routes
        app.use('/api/v1/favorite', favoriteRoutes);

        // image upload route
        app.use('/api/v1/image', imageRoutes);

    } catch(err) {
        console.log(err);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running ok')
})

export default app;