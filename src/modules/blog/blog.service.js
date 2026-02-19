import { dbService } from "../../services/database.service.js";

const getAllBlogPosts = async (filter, skip, limit, sort = 'newest') => {
    const blogCollection = dbService.blogPosts

    // Determine sort order based on sort parameter
    let sortOption = {};
    if (sort === 'newest') {
        sortOption = { publishedAt: -1 };
    } else if (sort === 'popular') {
        sortOption = { 'stats.views': -1 };
    } else if (sort === 'trending') {
        sortOption = { 'stats.likes': -1 };
    } else {
        sortOption = { publishedAt: -1 };
    }

    const result = await blogCollection
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();
    return result
}
const getDocumentCount = async (filter) => {
    const blogCollection = dbService.blogPosts
    const result = await blogCollection.countDocuments(filter);
    return result
}

const getBlogPostBySlug = async (slug) => {
    const blogCollection = dbService.blogPosts

    const result = await blogCollection.findOne({
        slug,
        status: 'published'
    })

    // Increment view count
    await blogCollection.updateOne(
        { slug },
        { $inc: { views: 1 } }
    );
    return result
}


export const blogServices = {
    getAllBlogPosts,
    getDocumentCount,
    getBlogPostBySlug
}