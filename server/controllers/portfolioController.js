const Profile = require('../models/Profile');
const Education = require('../models/Education');
const SkillCategory = require('../models/SkillCategory');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const SocialLink = require('../models/SocialLink');
const CodingProfile = require('../models/CodingProfile');
const Contact = require('../models/Contact');
const Resume = require('../models/Resume');
const Goal = require('../models/Goal');
const FocusArea = require('../models/FocusArea');
const CareerNode = require('../models/CareerNode');

// --- Helper for creating generic REST handlers ---
const createCrudHandlers = (Model, populateFields = []) => ({
  getAll: async (req, res) => {
    try {
      let query = Model.find();
      if (populateFields.length > 0) {
        populateFields.forEach(field => {
          query = query.populate(field);
        });
      }
      const data = await query.sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  create: async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.status(201).json({ success: true, data: item, message: 'Created successfully.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  update: async (req, res) => {
    try {
      // Strip undefined keys to prevent partial updates from erasing existing document fields
      const cleanData = Object.fromEntries(
        Object.entries(req.body || {}).filter(([_, v]) => v !== undefined)
      );
      const item = await Model.findByIdAndUpdate(req.params.id, cleanData, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
      res.json({ success: true, data: item, message: 'Updated successfully.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
      res.json({ success: true, message: 'Deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
});

// Profile Handlers
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    const profileObj = profile.toObject();

    // Single Source of Truth: Populate active resume URL dynamically from Resume collection
    const activeResume = await Resume.findOne({ active: true }).sort({ uploadedAt: -1 });
    if (activeResume && activeResume.url) {
      profileObj.resumeUrl = activeResume.url;
    }

    res.json({ success: true, data: profileObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    // Strip undefined keys to preserve untouched profile properties
    const cleanData = Object.fromEntries(
      Object.entries(req.body || {}).filter(([_, v]) => v !== undefined)
    );
    if (!profile) {
      profile = new Profile(cleanData);
    } else {
      Object.assign(profile, cleanData);
    }
    await profile.save();
    console.log('[Portfolio Controller] Profile updated successfully in MongoDB.');
    res.json({ success: true, data: profile, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('[Portfolio Controller] Profile update error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Project specific handlers
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('skills');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Resume specific handlers
const getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ active: true }).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.json({
        success: true,
        data: {
          title: 'Venkata_Siva_Reddy_Resume.pdf',
          url: '/Venkata_Siva_Reddy_Resume.pdf'
        }
      });
    }
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadResumeHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }
    const mime = req.file.mimetype || 'application/pdf';
    const base64Data = req.file.buffer.toString('base64');
    const fileUrl = `data:${mime};base64,${base64Data}`;
    
    // Deactivate previous active resumes
    await Resume.updateMany({}, { active: false });
    
    const newResume = new Resume({
      title: req.file.originalname,
      filename: req.file.originalname,
      url: fileUrl,
      active: true
    });
    await newResume.save();

    // Also synchronize profile document's resumeUrl field
    let profile = await Profile.findOne();
    if (profile) {
      profile.resumeUrl = fileUrl;
      await profile.save();
    }

    res.status(201).json({ success: true, data: newResume, message: 'Resume uploaded successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Image & File Upload Handler
const uploadMediaHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const mime = req.file.mimetype || 'image/png';
    const base64Data = req.file.buffer.toString('base64');
    const fileUrl = `data:${mime};base64,${base64Data}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.originalname,
      message: 'File uploaded successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  education: createCrudHandlers(Education),
  skillCategory: createCrudHandlers(SkillCategory),
  skill: createCrudHandlers(Skill),
  experience: createCrudHandlers(Experience, ['skills']),
  project: { ...createCrudHandlers(Project, ['skills']), getBySlug: getProjectBySlug },
  certification: createCrudHandlers(Certification, ['skills']),
  achievement: createCrudHandlers(Achievement),
  socialLink: createCrudHandlers(SocialLink),
  codingProfile: createCrudHandlers(CodingProfile),
  contact: createCrudHandlers(Contact),
  resume: { getActive: getActiveResume, upload: uploadResumeHandler },
  goal: createCrudHandlers(Goal),
  focusArea: createCrudHandlers(FocusArea),
  careerNode: createCrudHandlers(CareerNode),
  uploadMedia: uploadMediaHandler
};
