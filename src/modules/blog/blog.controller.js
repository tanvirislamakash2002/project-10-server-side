import { dbService } from "../../services/database.service.js";


// Get all published blog posts with pagination and filtering
const getAllBlogPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      tag
    } = req.query;

    const blogCollection = dbService.blogPosts;

    // Build filter for published posts only
    const filter = { status: 'published' };

    // Add category filter if provided
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Add tag filter if provided
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get posts with pagination
    const posts = await blogCollection
      .find(filter)
      .sort({ publishedAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const totalPosts = await blogCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: err.message
    });
  }
};

// Get single blog post by slug
const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blogCollection = dbService.blogPosts;


    const post = await blogCollection.findOne({
      slug,
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await blogCollection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );

    res.json({
      success: true,
      post
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: err.message
    });
  }
};

// Get related blog posts
const getRelatedPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 3 } = req.query;

    const blogCollection = dbService.blogPosts;


    // First get the current post to find related posts
    const currentPost = await blogCollection.findOne({ slug });

    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Find related posts by category or tags
    const relatedPosts = await blogCollection
      .find({
        slug: { $ne: slug }, // Exclude current post
        status: 'published',
        $or: [
          { category: currentPost.category },
          { tags: { $in: currentPost.tags } }
        ]
      })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      posts: relatedPosts
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related posts',
      error: err.message
    });
  }
};

// Get blog categories
const getBlogCategories = async (req, res) => {
  try {
    const blogCollection = dbService.blogPosts;


    const categories = await blogCollection.distinct('category', {
      status: 'published'
    });

    res.json({
      success: true,
      categories
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: err.message
    });
  }
};

// Get popular posts (most viewed)
const getPopularPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogCollection = dbService.blogPosts;


    const popularPosts = await blogCollection
      .find({ status: 'published' })
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      posts: popularPosts
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular posts',
      error: err.message
    });
  }
};

// Create new blog post (admin only)
const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      author,
      readTime
    } = req.body;
    console.log({
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      author,
      readTime
    });
    const blogCollection = dbService.blogPosts;


    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newPost = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      coverImage,
      author: author || 'The Roommate Team',
      readTime: readTime || '5 min read',
      status: 'published', // or 'draft' for unpublished posts
      views: 0,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const result = await blogCollection.insertOne(newPost);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      postId: result.insertedId,
      slug: newPost.slug
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog post with this title already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: err.message
    });
  }
};

// Newsletter subscription
const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const newsletterCollection = dbService.newsletterSubscriptions;

    // Check if email already exists
    const existingSubscriber = await newsletterCollection.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    const newSubscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true
    };

    await newsletterCollection.insertOne(newSubscriber);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: err.message
    });
  }
};

export const blogController = {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
  getBlogCategories,
  getPopularPosts,
  createBlogPost,
  subscribeToNewsletter
};