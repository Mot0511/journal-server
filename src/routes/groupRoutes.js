import express from 'express';
import GroupController from '../controllers/groupController.js';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';
import { validateRequest, groupSchema } from '../middleware/validation.js';

const router = express.Router();

// Роуты для всех авторизованных пользователей
router.get('/', authenticateToken, GroupController.getAllGroups);
router.get('/:id', authenticateToken, GroupController.getGroupById);
router.get('/:id/students', authenticateToken, GroupController.getGroupWithStudents);
router.get('/:id/subjects', authenticateToken, GroupController.getGroupSubjects);
router.get('/:id/stats', authenticateToken, GroupController.getGroupStats);

// Роуты только для преподавателей
router.post('/', authenticateToken, requireTeacher, validateRequest(groupSchema), GroupController.createGroup);
router.put('/:id', authenticateToken, requireTeacher, validateRequest(groupSchema), GroupController.updateGroup);
router.delete('/:id', authenticateToken, requireTeacher, GroupController.deleteGroup);

export default router;