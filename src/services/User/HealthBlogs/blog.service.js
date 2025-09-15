import { apiClient } from '../../../config/apiClient';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const blogService = {
  async getAllBlogs() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BLOGS.GET_ALL);
    const response = await apiClient.get(url); // ✅ header is included automatically
    return response.data;
  },

  async getBlogsByCategory(categoryId) {
    // If no categoryId provided, fallback to all blogs
    if (!categoryId) {
      return this.getAllBlogs();
    }
    const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOGS.GET_BY_CATEGORY, { categoryId });
    const url = getApiUrl(endpoint);
    const response = await apiClient.get(url);
    return response.data;
  },

  async getBlogById(blogPostId) {
    // Backend treats /blogs/posts/:id as category filter; to avoid 404s, fetch all and find client-side
    const all = await this.getAllBlogs();
    const posts = all?.posts || all || [];
    const found = posts.find(p => p.blogPostId === blogPostId) || null;
    return found;
  },

  async getAllCategories() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BLOG_CATEGORIES.GET_ALL);
    const response = await apiClient.get(url);
    return response.data;
  }
};
