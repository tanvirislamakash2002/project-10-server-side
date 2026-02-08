import { dbService } from "../../services/database.service.js"

const ifApplicationExist = async (data) => {
    const applicationCollection = dbService.applications
    const query = { listingId: data.listingId, providerId: data.providerId, status: 'pending' }
    const result = await applicationCollection.findOne(query)
    return result
}
export const applicationServices = {
    ifApplicationExist
}  