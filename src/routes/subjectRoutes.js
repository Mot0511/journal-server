import express from 'express';
import SubjectController from '../controllers/subjectController.js';
import { authenticateToken, requireTeacher, requireAuth } from '../middleware/auth.js';
import { validateRequest, subjectSchema } from '../middleware/validation.js';

const router = express.Router();

// Роуты для всех авторизованных пользователей
router.get('/', authenticateToken, requireAuth, SubjectController.getAllSubjects);
router.get('/:id', authenticateToken, requireAuth, SubjectController.getSubjectById);
router.get('/:id/teachers', authenticateToken, requireAuth, SubjectController.getSubjectTeachers);
router.get('/:id/groups', authenticateToken, requireAuth, SubjectController.getSubjectGroups);

// Роуты только для преподавателей
router.post('/', authenticateToken, requireTeacher, validateRequest(subjectSchema), SubjectController.createSubject);
router.put('/:id', authenticateToken, requireTeacher, validateRequest(subjectSchema), SubjectController.updateSubject);
router.delete('/:id', authenticateToken, requireTeacher, SubjectController.deleteSubject);

export default router;