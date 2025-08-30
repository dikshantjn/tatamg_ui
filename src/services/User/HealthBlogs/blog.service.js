import { apiClient } from '../../../config/apiClient';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const blogService = {
  async getAllBlogs() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BLOGS.GET_ALL);
    const response = await apiClient.get(url); // ✅ header is included automatically
    return response.data;
  },

  async getBlogById(blogPostId) {
    const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOGS.GET_ONE, { blogPostId });
    const url = getApiUrl(endpoint);
    const response = await apiClient.get(url); // ✅ header is included automatically
    return response.data;
  }
};
