import { dbService } from "../../services/database.service.js"


const application = async(req, res) => {
    const applicationCollection = dbService.applications
    const result = await applicationCollection.insertOne(req.body)
    res.status(200).json({
        success:true,
        result
    })
}

export const applicationController = {
    application
}