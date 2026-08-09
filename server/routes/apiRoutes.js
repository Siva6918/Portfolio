const express = require('express');
const router = express.Router();

const { verifyAdminPasswordHandler } = require('../controllers/adminController');
const portfolioController = require('../controllers/portfolioController');
const { sendContactEmail } = require('../controllers/contactEmailController');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const { adminVerifyLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

// Admin Verification
router.post('/admin/verify', adminVerifyLimiter, verifyAdminPasswordHandler);

// Contact Email
router.post('/contact/send', sendContactEmail);

// Media & File Uploads
router.post('/upload', requireAdminAuth, upload.single('file'), portfolioController.uploadMedia);
router.post('/resume/upload', requireAdminAuth, upload.single('resume'), portfolioController.resume.upload);

// Profile Routes
router.get('/profile', portfolioController.getProfile);
router.put('/profile', requireAdminAuth, portfolioController.updateProfile);

// Resume Route
router.get('/resume', portfolioController.resume.getActive);

// Helper function to register REST routes
const registerCrudRoutes = (path, handlerObj) => {
  router.get(`/${path}`, handlerObj.getAll);
  router.post(`/${path}`, requireAdminAuth, handlerObj.create);
  router.put(`/${path}/:id`, requireAdminAuth, handlerObj.update);
  router.delete(`/${path}/:id`, requireAdminAuth, handlerObj.delete);
};

// Register Collection Routes
registerCrudRoutes('education', portfolioController.education);
registerCrudRoutes('skill-categories', portfolioController.skillCategory);
registerCrudRoutes('skills', portfolioController.skill);
registerCrudRoutes('experience', portfolioController.experience);

// Projects (with slug route)
router.get('/projects', portfolioController.project.getAll);
router.get('/projects/:slug', portfolioController.project.getBySlug);
router.post('/projects', requireAdminAuth, portfolioController.project.create);
router.put('/projects/:id', requireAdminAuth, portfolioController.project.update);
router.delete('/projects/:id', requireAdminAuth, portfolioController.project.delete);

registerCrudRoutes('certifications', portfolioController.certification);
registerCrudRoutes('achievements', portfolioController.achievement);
registerCrudRoutes('social-links', portfolioController.socialLink);
registerCrudRoutes('coding-profiles', portfolioController.codingProfile);
registerCrudRoutes('contacts', portfolioController.contact);
registerCrudRoutes('goals', portfolioController.goal);
registerCrudRoutes('focus-areas', portfolioController.focusArea);
registerCrudRoutes('career-nodes', portfolioController.careerNode);

module.exports = router;
