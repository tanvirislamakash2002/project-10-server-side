import { dbService } from "../../services/database.service.js"

const ifApplicationExist = async (applicant_id, listing_id) => {
    const applicationCollection = dbService.applications

    const query = {
        listingId: listing_id,
        applicantId: "69860b6c9b5a62d35f79733b",
        status: 'pending'
    }

    const result = await applicationCollection.findOne(query)
    return result
}

const application = async (data) => {
    const applicationCollection = dbService.applications

    const result = await applicationCollection.insertOne(data)
    return result

}
export const applicationServices = {
    ifApplicationExist,
    application
}  