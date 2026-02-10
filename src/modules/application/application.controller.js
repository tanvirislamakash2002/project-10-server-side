import { applicationServices } from "./application.service.js"


const submitApplication = async (req, res) => {
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
            const result = await applicationServices.submitApplication(data)
            res.status(200).json({
                success: true,
                result
            })
        }
        res.status(404).json({
            success: false,
            message: "application is pending",
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

    try {
        const { _id } = req?.user;
        const applicantId = _id.toString()

        const { listing_id } = req?.query;

        const ifApplicationExist = await applicationServices.ifApplicationExist(applicantId, listing_id)

        if (ifApplicationExist) {
            return res.status(200).json({
                success: true,
                details: ifApplicationExist
            })
        }
        return res.status(200).json({
            success: false,
            message: 'no application exist'
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            details: err
        })
    }


}
const getMyApplications = async (req, res) => {

    try {
        const { _id } = req?.user;
        const applicantId = _id.toString()

        const getMyApplications = await applicationServices.getMyApplications(applicantId)

        if (ifApplicationExist) {
            return res.status(200).json({
                success: true,
                details: getMyApplications
            })
        }
        return res.status(200).json({
            success: false,
            message: 'no'
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            details: err
        })
    }


}

export const applicationController = {
    submitApplication,
    ifApplicationExist,
    getMyApplications
}