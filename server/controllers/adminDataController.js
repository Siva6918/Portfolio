const Message = require('../models/Message');
const FreelanceOpportunity = require('../models/FreelanceOpportunity');

const adminDataController = {
  getMessages: async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting message' });
    }
  },
  getFreelanceOpportunities: async (req, res) => {
    try {
      const opps = await FreelanceOpportunity.find().sort({ createdAt: -1 });
      res.json({ success: true, data: opps });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching opportunities' });
    }
  },
  deleteFreelanceOpportunity: async (req, res) => {
    try {
      await FreelanceOpportunity.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Opportunity deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting opportunity' });
    }
  }
};

module.exports = adminDataController;
