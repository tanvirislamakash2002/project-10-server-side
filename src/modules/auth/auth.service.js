import { dbService } from "../../services/database.service.js";

const checkUserEmail = async (email) => {
    const usersCollection = dbService.users
    const result = await usersCollection.findOne({ email });
    return result
}
const loginUser = async (email) => {
    const usersCollection = dbService.users
        // Update last login time:
    const result = await usersCollection.updateOne(
      { email },
      { $set: { lastLogin: new Date().toISOString() } }
    );
    return result
}

export const authServices = {
    checkUserEmail,
    loginUser
}