import { dbService } from "../../services/database.service.js"


const application = async (req, res) => {
    try {
        const applicationCollection = dbService.applications

        const data = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        const result = await applicationCollection.insertOne(data)
        res.status(200).json({
            success: true,
            result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

export const applicationController = {
    application
}