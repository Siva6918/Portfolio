import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
export const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;

// Derive the server origin from the API base URL (strip trailing /api)
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

/**
 * Builds a clean, fully-qualified API URL for an endpoint path
 */
export const buildApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = API_BASE.replace(/\/+$/, '');
  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${base}${cleanEndpoint.substring(4)}`;
  }
  return `${base}${cleanEndpoint}`;
};

/**
 * Resolves a media path (like /uploads/file.jpg or uploads/file.jpg) into a full URL
 * pointing at the server with optional timestamp cache-busting.
 */
export const resolveMediaUrl = (path, updatedAt) => {
  if (!path) return '';
  
  // Data URIs don't need server origin or query strings
  if (path.startsWith('data:')) return path;
  
  let resolved = path;
  
  if (!path.startsWith('http://') && !path.startsWith('https://')) {
    // Normalize path with leading slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Server-hosted upload — prefix with server origin
    if (normalizedPath.startsWith('/uploads/')) {
      resolved = `${SERVER_ORIGIN}${normalizedPath}`;
    }
  }

  // Append cache-busting timestamp query string if updatedAt is provided
  if (updatedAt && !resolved.startsWith('data:')) {
    const timestamp = new Date(updatedAt).getTime();
    if (!isNaN(timestamp) && timestamp > 0) {
      const separator = resolved.includes('?') ? '&' : '?';
      resolved = `${resolved}${separator}v=${timestamp}`;
    }
  }

  return resolved;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject Authorization header or x-admin-password header if stored
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const authHeader = (pwd) => (pwd ? { headers: { 'x-admin-password': pwd } } : {});

export const getProfile = () => api.get('/profile');
export const updateProfile = (data, pwd) => api.put('/profile', data, authHeader(pwd));

export const getEducation = () => api.get('/education');
export const createEducation = (data, pwd) => api.post('/education', data, authHeader(pwd));
export const updateEducation = (id, data, pwd) => api.put(`/education/${id}`, data, authHeader(pwd));
export const deleteEducation = (id, pwd) => api.delete(`/education/${id}`, authHeader(pwd));

export const getSkillCategories = () => api.get('/skill-categories');
export const createSkillCategory = (data, pwd) => api.post('/skill-categories', data, authHeader(pwd));
export const updateSkillCategory = (id, data, pwd) => api.put(`/skill-categories/${id}`, data, authHeader(pwd));
export const deleteSkillCategory = (id, pwd) => api.delete(`/skill-categories/${id}`, authHeader(pwd));

export const getSkills = () => api.get('/skills');
export const createSkill = (data, pwd) => api.post('/skills', data, authHeader(pwd));
export const updateSkill = (id, data, pwd) => api.put(`/skills/${id}`, data, authHeader(pwd));
export const deleteSkill = (id, pwd) => api.delete(`/skills/${id}`, authHeader(pwd));

export const getExperience = () => api.get('/experience');
export const createExperience = (data, pwd) => api.post('/experience', data, authHeader(pwd));
export const updateExperience = (id, data, pwd) => api.put(`/experience/${id}`, data, authHeader(pwd));
export const deleteExperience = (id, pwd) => api.delete(`/experience/${id}`, authHeader(pwd));

export const getProjects = () => api.get('/projects');
export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`);
export const createProject = (data, pwd) => api.post('/projects', data, authHeader(pwd));
export const updateProject = (id, data, pwd) => api.put(`/projects/${id}`, data, authHeader(pwd));
export const deleteProject = (id, pwd) => api.delete(`/projects/${id}`, authHeader(pwd));

export const getCertifications = () => api.get('/certifications');
export const createCertification = (data, pwd) => api.post('/certifications', data, authHeader(pwd));
export const updateCertification = (id, data, pwd) => api.put(`/certifications/${id}`, data, authHeader(pwd));
export const deleteCertification = (id, pwd) => api.delete(`/certifications/${id}`, authHeader(pwd));

export const getAchievements = () => api.get('/achievements');
export const createAchievement = (data, pwd) => api.post('/achievements', data, authHeader(pwd));
export const updateAchievement = (id, data, pwd) => api.put(`/achievements/${id}`, data, authHeader(pwd));
export const deleteAchievement = (id, pwd) => api.delete(`/achievements/${id}`, authHeader(pwd));

export const getSocialLinks = () => api.get('/social-links');
export const createSocialLink = (data, pwd) => api.post('/social-links', data, authHeader(pwd));
export const updateSocialLink = (id, data, pwd) => api.put(`/social-links/${id}`, data, authHeader(pwd));
export const deleteSocialLink = (id, pwd) => api.delete(`/social-links/${id}`, authHeader(pwd));

export const getCodingProfiles = () => api.get('/coding-profiles');
export const createCodingProfile = (data, pwd) => api.post('/coding-profiles', data, authHeader(pwd));
export const updateCodingProfile = (id, data, pwd) => api.put(`/coding-profiles/${id}`, data, authHeader(pwd));
export const deleteCodingProfile = (id, pwd) => api.delete(`/coding-profiles/${id}`, authHeader(pwd));

export const getContacts = () => api.get('/contacts');
export const createContact = (data, pwd) => api.post('/contacts', data, authHeader(pwd));
export const updateContact = (id, data, pwd) => api.put(`/contacts/${id}`, data, authHeader(pwd));
export const deleteContact = (id, pwd) => api.delete(`/contacts/${id}`, authHeader(pwd));

export const getCareerNodes = () => api.get('/career-nodes');
export const createCareerNode = (data, pwd) => api.post('/career-nodes', data, authHeader(pwd));
export const updateCareerNode = (id, data, pwd) => api.put(`/career-nodes/${id}`, data, authHeader(pwd));
export const deleteCareerNode = (id, pwd) => api.delete(`/career-nodes/${id}`, authHeader(pwd));

export const getResume = () => api.get('/resume');

export const uploadMedia = (formData, pwd) => api.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    ...(pwd ? { 'x-admin-password': pwd } : {})
  }
});

export const uploadResumeFile = (formData, pwd) => api.post('/resume/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    ...(pwd ? { 'x-admin-password': pwd } : {})
  }
});

export default api;
