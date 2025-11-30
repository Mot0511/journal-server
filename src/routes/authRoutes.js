import express from 'express';
import AuthController from '../controllers/authController.js';
import { validateRequest, loginSchema, studentRegistrationSchema, teacherRegistrationSchema, changePasswordSchema } from '../middleware/validation.js';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';

const router = express.Router();

// Публичные роуты (без аутентификации)
router.post('/login/student', validateRequest(loginSchema), AuthController.loginStudent);
router.post('/login/teacher', validateRequest(loginSchema), AuthController.loginTeacher);

// Защищенные роуты (требуют аутентификации)
router.get('/me', authenticateToken, AuthController.getMe);
router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);
router.post('/logout', authenticateToken, AuthController.logout);

// Роуты только для преподавателей
router.post('/register/student', authenticateToken, requireTeacher, validateRequest(studentRegistrationSchema), AuthController.registerStudent);
router.post('/register/teacher', authenticateToken, requireTeacher, validateRequest(teacherRegistrationSchema), AuthController.registerTeacher);

export default router;