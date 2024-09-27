import Post from "../db/post.model.js";

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;

  const newPost = new Post({
    title,
    content,
    author: authorId,
  });

  try {
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email") 
      .populate({
        path: "comments.author", 
        select: "username email", 
      });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post." });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    return res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.user.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = { content, author: authorId };
    post.comments.push(comment);

    await post.save();
    return res
      .status(201)
      .json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
      return res.status(200).json({ message: "Post liked", post });
    } else {
      post.likes.splice(likeIndex, 1);
      return res.status(200).json({ message: "Post unliked", post });
    }

    await post.save();
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
