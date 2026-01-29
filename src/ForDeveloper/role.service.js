import { ObjectId } from "mongodb";
import { dbService } from "../services/database.service.js";

const updateRole = async (userId, role) => {
    const userCollection = dbService.users;

    const result = await userCollection.updateOne(
        {
            _id: new ObjectId(userId),
            developer: 'true'
        },
        {
            $set: {
                role: role,
                updatedAt: new Date()
            }
        }
    );
    return result
}

export const roleService = {
    updateRole
}