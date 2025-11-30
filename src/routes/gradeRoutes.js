import express from 'express';
import GradeController from '../controllers/gradeController.js';
import { authenticateToken, requireTeacher, requireAuth } from '../middleware/auth.js';
import { validateRequest, activitySchema, lessonSchema } from '../middleware/validation.js';

const router = express.Router();

// Роуты для активностей
router.get('/activities', authenticateToken, requireAuth, GradeController.getAllActivities);
router.get('/activities/journal', authenticateToken, requireTeacher, GradeController.getJournalActivities);
router.get('/activities/student/:studentId', authenticateToken, requireAuth, GradeController.getStudentActivities);
router.get('/activities/subject/:subjectId', authenticateToken, requireTeacher, GradeController.getSubjectActivities);

router.post('/activities', authenticateToken, requireTeacher, validateRequest(activitySchema), GradeController.createActivity);
router.put('/activities/:id', authenticateToken, requireTeacher, GradeController.updateActivity);
router.delete('/activities/:id', authenticateToken, requireTeacher, GradeController.deleteActivity);

router.delete('/labs/:id', authenticateToken, requireTeacher, GradeController.deleteLab);

// Роуты для занятий
router.get('/lessons', authenticateToken, requireAuth, GradeController.getAllLessons);
router.get('/lessons/journal', authenticateToken, requireTeacher, GradeController.getJournalLessons);
router.get('/lessons/student/:studentId', authenticateToken, requireAuth, GradeController.getStudentLessons);

router.post('/lessons', authenticateToken, requireTeacher, validateRequest(lessonSchema), GradeController.createLesson);
router.post('/lessons/bulk', authenticateToken, requireTeacher, GradeController.createBulkLessons);
router.put('/lessons/:id', authenticateToken, requireTeacher, GradeController.updateLesson);
router.delete('/lessons/:subjectId/:subjectType/:date', authenticateToken, requireTeacher, GradeController.deleteLesson);
router.delete('/lessons/:lessonId', authenticateToken, requireTeacher, GradeController.deleteLessonById);

// Роуты для статистики
router.get('/stats/attendance/:studentId', authenticateToken, requireAuth, GradeController.getAttendanceStats);
router.get('/stats/student/:studentId', authenticateToken, requireAuth, GradeController.getStudentStats);

export default router;