const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
export const api = {
  // Contact form submission
  async submitContact(data) {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all blogs
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_URL}/blogs?${query}` : `${API_URL}/blogs`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get single blog by slug
  async getBlog(slug) {
    try {
      const response = await fetch(`${API_URL}/blogs/${slug}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all tags
  async getTags() {
    try {
      const response = await fetch(`${API_URL}/blogs/tags/all`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
