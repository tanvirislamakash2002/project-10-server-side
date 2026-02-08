import jwt from "jsonwebtoken"

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'no token, authorization denied' })
        }
        // verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            _id: decoded.id,
            email: decoded.email
        }
        next();
    } catch (error) {
        res.status(401).json({ error: "Token is not valid" })
    }
}

export default protect