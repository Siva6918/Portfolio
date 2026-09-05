const WorkspaceItem = require('../models/WorkspaceItem');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const path = require('path');

const uploadStreamToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

const getResourceType = (mimeType, originalName) => {
  const ext = path.extname(originalName || '').toLowerCase();
  if (mimeType.startsWith('video/') || ['.mp4', '.webm', '.mov', '.avi'].includes(ext)) return 'video';
  if (mimeType === 'application/pdf' || ext === '.pdf') return 'pdf';
  if (mimeType.includes('msword') || mimeType.includes('officedocument.word') || ['.doc', '.docx'].includes(ext)) return 'document';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || ['.xls', '.xlsx', '.csv'].includes(ext)) return 'excel';
  if (mimeType.startsWith('image/')) return 'image';
  return null;
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const workspaceController = {
  getAll: async (req, res) => {
    try {
      const items = await WorkspaceItem.find().sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, data: items });
    } catch (error) {
      console.error('[Workspace getAll Error]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch workspace items' });
    }
  },

  create: async (req, res) => {
    try {
      const { category, name, description, externalUrl, isVisible, displayOrder } = req.body;
      const files = req.files || {};
      
      if (!files.coverImage || !files.coverImage[0]) {
        return res.status(400).json({ success: false, message: 'Cover image is compulsory' });
      }
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ success: false, message: 'Cloudinary not configured' });
      }

      // Upload Cover Image
      const coverImageFile = files.coverImage[0];
      const coverUpload = await uploadStreamToCloudinary(coverImageFile.buffer, {
        folder: `portfolio/workspace/${category}/cover`,
        resource_type: 'image'
      });

      let resourceObj = {};
      let resourceType = null;
      let resourceMimeType = null;
      let resourceFormat = null;

      // Handle File Resource
      if (files.resource && files.resource[0]) {
        const resFile = files.resource[0];
        resourceMimeType = resFile.mimetype;
        resourceType = getResourceType(resourceMimeType, resFile.originalname);
        const resUploadType = resourceType === 'video' ? 'video' : 'auto';
        
        const resUpload = await uploadStreamToCloudinary(resFile.buffer, {
          folder: `portfolio/workspace/${category}/resource`,
          resource_type: resUploadType
        });
        resourceObj = { url: resUpload.secure_url, public_id: resUpload.public_id };
        resourceFormat = resUpload.format || path.extname(resFile.originalname).replace('.', '');
      } else if (externalUrl) {
        resourceType = 'link';
      }

      let baseSlug = slugify(name) || 'workspace-item';
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await WorkspaceItem.exists({ category, slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      const newItem = await WorkspaceItem.create({
        category,
        name,
        slug: uniqueSlug,
        description,
        coverImage: { url: coverUpload.secure_url, public_id: coverUpload.public_id },
        resource: Object.keys(resourceObj).length > 0 ? resourceObj : undefined,
        resourceType,
        resourceMimeType,
        resourceFormat,
        externalUrl,
        isVisible: isVisible !== undefined ? isVisible === 'true' : true,
        displayOrder: displayOrder || 0
      });

      res.status(201).json({ success: true, data: newItem, message: 'Item created successfully' });
    } catch (error) {
      console.error('[Workspace create Error]', error);
      res.status(500).json({ success: false, message: 'Failed to create workspace item' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { category, name, description, externalUrl, isVisible, displayOrder } = req.body;
      const files = req.files || {};
      
      const item = await WorkspaceItem.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

      let coverImageObj = item.coverImage;
      if (files.coverImage && files.coverImage[0]) {
        if (coverImageObj.public_id) {
          await cloudinary.uploader.destroy(coverImageObj.public_id, { resource_type: 'image' });
        }
        const coverUpload = await uploadStreamToCloudinary(files.coverImage[0].buffer, {
          folder: `portfolio/workspace/${item.category}/cover`,
          resource_type: 'image'
        });
        coverImageObj = { url: coverUpload.secure_url, public_id: coverUpload.public_id };
      }

      let resourceObj = item.resource || {};
      let resourceType = item.resourceType;
      let resourceMimeType = item.resourceMimeType;
      let resourceFormat = item.resourceFormat;

      if (files.resource && files.resource[0]) {
        if (resourceObj.public_id) {
          const oldResType = item.resourceType === 'video' ? 'video' : 'raw';
          // auto/image destruction usually works with 'image' type which is default if not raw/video
          const resTypeToDestroy = item.resourceType === 'video' ? 'video' : (['document', 'excel', 'pdf'].includes(item.resourceType) ? 'raw' : 'image');
          await cloudinary.uploader.destroy(resourceObj.public_id, { resource_type: resTypeToDestroy }).catch(() => {});
        }
        
        const resFile = files.resource[0];
        resourceMimeType = resFile.mimetype;
        resourceType = getResourceType(resourceMimeType, resFile.originalname);
        const resUploadType = resourceType === 'video' ? 'video' : 'auto';
        
        const resUpload = await uploadStreamToCloudinary(resFile.buffer, {
          folder: `portfolio/workspace/${item.category}/resource`,
          resource_type: resUploadType
        });
        resourceObj = { url: resUpload.secure_url, public_id: resUpload.public_id };
        resourceFormat = resUpload.format || path.extname(resFile.originalname).replace('.', '');
      } else if (externalUrl !== undefined && externalUrl !== item.externalUrl) {
        if (resourceObj.public_id) {
          const resTypeToDestroy = item.resourceType === 'video' ? 'video' : (['document', 'excel', 'pdf'].includes(item.resourceType) ? 'raw' : 'image');
          await cloudinary.uploader.destroy(resourceObj.public_id, { resource_type: resTypeToDestroy }).catch(() => {});
          resourceObj = {};
          resourceMimeType = null;
          resourceFormat = null;
        }
        if (externalUrl) {
          resourceType = 'link';
        } else {
          resourceType = null;
        }
      }

      let itemSlug = item.slug;
      if (!itemSlug || (name && name !== item.name)) {
        let baseSlug = slugify(name || item.name) || 'workspace-item';
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await WorkspaceItem.exists({ category: category || item.category, slug: uniqueSlug, _id: { $ne: id } })) {
          uniqueSlug = `${baseSlug}-${counter++}`;
        }
        itemSlug = uniqueSlug;
      }

      const updatedItem = await WorkspaceItem.findByIdAndUpdate(id, {
        category: category || item.category,
        name: name || item.name,
        slug: itemSlug,
        description: description || item.description,
        coverImage: coverImageObj,
        resource: Object.keys(resourceObj).length > 0 ? resourceObj : undefined,
        resourceType,
        resourceMimeType,
        resourceFormat,
        externalUrl,
        isVisible: isVisible !== undefined ? isVisible === 'true' : item.isVisible,
        displayOrder: displayOrder !== undefined ? displayOrder : item.displayOrder
      }, { new: true });

      res.json({ success: true, data: updatedItem, message: 'Item updated successfully' });
    } catch (error) {
      console.error('[Workspace update Error]', error);
      res.status(500).json({ success: false, message: 'Failed to update workspace item' });
    }
  },

  getByCategoryAndSlug: async (req, res) => {
    try {
      const { category, slug } = req.params;
      
      // 1. Try finding by category and exact slug
      let item = await WorkspaceItem.findOne({ category, slug, isVisible: true });
      
      // 2. If not found, try finding by MongoDB _id (if valid ObjectId)
      if (!item && slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
        item = await WorkspaceItem.findOne({ _id: slug, category, isVisible: true });
      }

      // 3. Fallback: match by slugified name
      if (!item) {
        const allItems = await WorkspaceItem.find({ category, isVisible: true });
        item = allItems.find(i => (i.slug && i.slug === slug) || slugify(i.name) === slug);
      }

      if (!item) {
        return res.status(404).json({ success: false, message: 'Workspace item not found' });
      }

      res.json({ success: true, data: item });
    } catch (error) {
      console.error('[Workspace getByCategoryAndSlug Error]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch workspace item' });
    }
  },

  delete: async (req, res) => {
    try {
      const item = await WorkspaceItem.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

      if (item.coverImage && item.coverImage.public_id) {
        await cloudinary.uploader.destroy(item.coverImage.public_id, { resource_type: 'image' }).catch(() => {});
      }
      if (item.resource && item.resource.public_id) {
        const resTypeToDestroy = item.resourceType === 'video' ? 'video' : (['document', 'excel', 'pdf'].includes(item.resourceType) ? 'raw' : 'image');
        await cloudinary.uploader.destroy(item.resource.public_id, { resource_type: resTypeToDestroy }).catch(() => {});
      }

      await WorkspaceItem.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      console.error('[Workspace delete Error]', error);
      res.status(500).json({ success: false, message: 'Failed to delete workspace item' });
    }
  }
};

module.exports = workspaceController;
