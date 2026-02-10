import { dbService } from "../../services/database.service.js"
import { applicationServices } from "./application.service.js"


const application = async (req, res) => {
    try {
        const { _id } = req?.user;
        const applicant_id = _id.toString()
        const { listingId } = req?.body;

        const data = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const ifApplicationExist = await applicationServices.ifApplicationExist(applicant_id, listingId)
        if (!ifApplicationExist) {
            const result = await applicationServices.application(data)
            res.status(200).json({
                success: true,
                result
            })
        }
        res.status(404).json({
            success: false,
            message:"application is pending",
            ifApplicationExist
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

    const { _id} = req?.user;
    const applicantId = _id.toString()
    const { listing_id } = req?.query;
    const ifApplicationExist = await applicationServices.ifApplicationExist(applicantId, listing_id)
    res.status(200).json({
        success: true,
        details: ifApplicationExist,
        user: { applicantId, listing_id }
    })
}

export const applicationController = {
    application,
    ifApplicationExist
}