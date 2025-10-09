import Content from '../models/Content.js';
import { createNotification } from './notificationController.js';
import { createActivityLog } from './activityLogController.js';

// Get all unique content types from the database
export const getAllContentTypes = async (req, res) => {
    try {
        const contentTypes = await Content.distinct('type');
        res.json({ success: true, data: contentTypes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get content by its type from the database
export const getContentByType = async (req, res) => {
  const { type } = req.params;
  try {
    let content = await Content.findOne({ type });
    // If content for a type doesn't exist, create a default entry
    if (!content) {
      const defaultTitle = type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
      content = new Content({ type, title: defaultTitle, content: '' });
      await content.save();
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update content by its type in the database
export const updateContent = async (req, res) => {
  const { type } = req.params;
  const { title, content } = req.body;
  try {
    // Find the document by type and update it, or create it if it doesn't exist (upsert)
    const contentDoc = await Content.findOneAndUpdate(
        { type },
        { title, content },
        { new: true, upsert: true, runValidators: true }
    );

    const io = req.app.get('io');
    if (io && req.user.role === 'employee') {
        const message = `Employee ${req.user.firstName} updated the '${type}' content.`;
        const link = '/owner/content-management';
        const newLog = await createActivityLog(req.user.id, 'UPDATE_CONTENT', `Content: ${type}`, link);
        const notifications = await createNotification({ roles: ['admin'], module: 'content' }, message, { admin: link });

        io.to('admin').emit('activity-log-update', newLog);

        if (notifications && notifications.length > 0) {
            io.to('admin').emit('notification', notifications[0]);
        }
    }

    res.json({ success: true, message: 'Content updated successfully', data: contentDoc });
  } catch (error) {
      res.status(400).json({ success: false, message: error.message });
  }
};
