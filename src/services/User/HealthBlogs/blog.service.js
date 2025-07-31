import axios from 'axios';
import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const blogService = {
  async getAllBlogs() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BLOGS.GET_ALL);
    const response = await axios.get(url);
    return response.data;
  },

  async getBlogById(blogPostId) {
    const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.BLOGS.GET_ONE, { blogPostId });
    const url = getApiUrl(endpoint);
    const response = await axios.get(url);
    return response.data;
  }
}; 