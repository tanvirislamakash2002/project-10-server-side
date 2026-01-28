import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(), ".env")})

const config = {
port: process.env.PORT,
mongodb_uri: process.env.MONGODB_URI,
imgbb_api_key: process.env.IMGBB_API_KEY
}

export default config;