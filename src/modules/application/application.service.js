import { dbService } from "../../services/database.service.js"

const ifApplicationExist = async (applicant_id, listing_id) => {
    const applicationCollection = dbService.applications

    const query = {
        listingId: listing_id,
        applicantId: applicant_id,
        status: 'pending'
    }
    const result = await applicationCollection.findOne(query)
    return result
}

const submitApplication = async (data) => {
    const applicationCollection = dbService.applications

    const result = await applicationCollection.insertOne(data)
    return result

}

const getMyApplications = async (applicant_id, listing_id) => {
    const applicationCollection = dbService.applications

    const query = {
        applicantId: applicant_id
    }
    const result = await applicationCollection.find(query).toArray()
    return result
}

export const applicationServices = {
    ifApplicationExist,
    submitApplication,
    getMyApplications
}  