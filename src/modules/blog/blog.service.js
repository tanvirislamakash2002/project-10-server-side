import { dbService } from "../../services/database.service.js";

const getAllBlogPosts = async (email) => {
    const blogCollection = dbService.blogPosts
    const result = await blogCollection
      .find(filter)
      .sort({ publishedAt: -1 }) 
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
      return result
}


export const blogServices = {
    checkUserEmail,
    loginUser
}