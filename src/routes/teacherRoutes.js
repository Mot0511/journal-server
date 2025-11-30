import express from 'express';
import TeacherController from '../controllers/teacherController.js';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';

const router = express.Router();

// Роуты для всех авторизованных пользователей
router.get('/me', authenticateToken, TeacherController.getCurrentTeacher);

// Роуты только для преподавателей
router.get('/', authenticateToken, requireTeacher, TeacherController.getAllTeachers);
router.get('/:id', authenticateToken, requireTeacher, TeacherController.getTeacherById);
router.get('/:id/subjects', authenticateToken, requireTeacher, TeacherController.getTeacherSubjects);
router.get('/:id/students', authenticateToken, requireTeacher, TeacherController.getTeacherStudents);
router.get('/:id/activities', authenticateToken, requireTeacher, TeacherController.getStudentActivities);

router.put('/:id', authenticateToken, requireTeacher, TeacherController.updateTeacher);
router.delete('/:id', authenticateToken, requireTeacher, TeacherController.deleteTeacher);

export default router;