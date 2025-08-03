
import express from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for tasks within a specific project
// These match the frontend pattern: /api/tasks/project/:projectId
router.get('/project/:projectId', protect, getTasks);
router.post('/project/:projectId', protect, createTask);

// Individual task routes
// These match the frontend pattern: /api/tasks/:id
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
