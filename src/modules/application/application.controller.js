import { dbService } from "../../services/database.service.js"
import { applicationServices } from "./application.service.js"


const application = async (req, res) => {
    try {
        const applicationCollection = dbService.applications

        const data = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        console.log('akash req user', req.user);
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

const ifApplicationExist = async (req, res) => {

    const { _id: applicant_id } = req?.user;
    const { listing_id } = req?.query;

    const result = await applicationServices.ifApplicationExist(applicant_id, listing_id)
    res.status(200).json({
        success: true,
        details: result,
        user: { applicant_id, listing_id }
    })
}

export const applicationController = {
    application,
    ifApplicationExist
}