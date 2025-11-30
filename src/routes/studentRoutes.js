import express from 'express';
import StudentController from '../controllers/studentController.js';
import { authenticateToken, requireTeacher, requireAuth } from '../middleware/auth.js';
import { validateRequest, studentRegistrationSchema } from '../middleware/validation.js';

const router = express.Router();

// Публичные роуты (без аутентификации)
router.get('/public', StudentController.getAllStudentsPublic);
router.get('/public/group/:groupId', StudentController.getStudentsByGroupPublic);

// Роуты для всех авторизованных пользователей
router.get('/me', authenticateToken, StudentController.getCurrentStudent);

// Роуты только для преподавателей
router.get('/', authenticateToken, requireTeacher, StudentController.getAllStudents);
router.get('/:id', authenticateToken, requireTeacher, StudentController.getStudentById);
router.get('/:id/full', authenticateToken, requireTeacher, StudentController.getStudentFullInfo);
router.get('/group/:groupId', authenticateToken, requireTeacher, StudentController.getStudentsByGroup);

router.post('/', authenticateToken, requireTeacher, validateRequest(studentRegistrationSchema), StudentController.createStudent);
router.put('/:id', authenticateToken, requireTeacher, StudentController.updateStudent);
router.delete('/:id', authenticateToken, requireTeacher, StudentController.deleteStudent);

export default router;