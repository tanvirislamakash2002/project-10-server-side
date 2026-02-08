import jwt from "jsonwebtoken"
import { dbService } from "../services/database.service.js";

const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'no token provided' })
        }
        // verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //  find user in database
        const usersCollection = dbService.users;
        const user = await usersCollection.find({
            email: decoded.email
        }).select('-__v')
        console.log('auth in jwt', user);

        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" })
    }
}

export const authMiddleware = { generateToken, protect }