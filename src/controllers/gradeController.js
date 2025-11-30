import Activity from '../models/Activity.js';
import Lesson from '../models/Lesson.js';

class GradeController {
  // Получить все активности (с пагинацией)
  static async getAllActivities(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const activities = await Activity.findAll(parseInt(limit), parseInt(offset));
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активностей',
        error: error.message
      });
    }
  }

  // Получить активности студента
  static async getStudentActivities(req, res) {
    try {
      const { studentId } = req.params;
      const activities = await Activity.findByStudentId(studentId);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активностей студента',
        error: error.message
      });
    }
  }

  // Получить активности по предмету
  static async getSubjectActivities(req, res) {
    try {
      const { subjectId } = req.params;
      const activities = await Activity.findBySubjectId(subjectId);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активностей по предмету',
        error: error.message
      });
    }
  }

  // Получить активности для журнала (по преподавателю и предмету)
  static async getJournalActivities(req, res) {
    try {
      const { teacherId, subjectId } = req.query;
      const { groupId } = req.query;
      
      if (!teacherId || !subjectId) {
        return res.status(400).json({
          success: false,
          message: 'ID преподавателя и предмета обязательны'
        });
      }

      const activities = await Activity.getJournalActivities(teacherId, subjectId, groupId);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активностей журнала',
        error: error.message
      });
    }
  }

  // Создать новую активность
  static async createActivity(req, res) {
    try {
      const activity = await Activity.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Активность успешно создана',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании активности',
        error: error.message
      });
    }
  }

  // Обновить активность
  static async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.update(id, req.body);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Активность не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Активность успешно обновлена',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении активности',
        error: error.message
      });
    }
  }

  // Удалить активность
  static async deleteActivity(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.delete(id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Активность не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Активность успешно удалена',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении активности',
        error: error.message
      });
    }
  }

  static async deleteLab(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.deleteLab(id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Лаба не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Лаба успешно удалена',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении лабы',
        error: error.message
      });
    }
  }

  // Получить все занятия (с пагинацией)
  static async getAllLessons(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const lessons = await Lesson.findAll(parseInt(limit), parseInt(offset));
      
      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении занятий',
        error: error.message
      });
    }
  }

  // Получить занятия студента
  static async getStudentLessons(req, res) {
    try {
      const { studentId } = req.params;
      const lessons = await Lesson.findByStudentId(studentId);
      
      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении занятий студента',
        error: error.message
      });
    }
  }

  // Получить занятия для журнала
  static async getJournalLessons(req, res) {
    try {
      const { subjectId } = req.query;
      const { groupId, typeSubjectId } = req.query;
      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: 'ID предмета обязателен'
        });
      }

      const lessons = await Lesson.getJournalLessons(subjectId, groupId, typeSubjectId);
      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении занятий журнала',
        error: error.message
      });
    }
  }

  // Создать новое занятие
  static async createLesson(req, res) {
    try {
      const lesson = await Lesson.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Занятие успешно создано',
        data: lesson
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании занятия',
        error: error.message
      });
    }
  }

  // Массовое создание занятий для группы
  static async createBulkLessons(req, res) {
    try {
      const { groupId, subjectId, typeSubjectId, date, defaultMark = '' } = req.body;
      
      if (!groupId || !subjectId || !typeSubjectId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Обязательные поля: groupId, subjectId, typeSubjectId, date'
        });
      }

      const lessons = await Lesson.createBulkForGroup(groupId, subjectId, typeSubjectId, date, defaultMark);
      
      res.status(201).json({
        success: true,
        message: 'Занятия успешно созданы для группы',
        data: lessons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании занятий для группы',
        error: error.message
      });
    }
  }

  // Получить статистику посещаемости студента
  static async getAttendanceStats(req, res) {
    try {
      const { studentId } = req.params;
      const { subjectId } = req.query;
      
      const stats = await Lesson.getAttendanceStats(studentId, subjectId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении статистики посещаемости',
        error: error.message
      });
    }
  }

  // Получить статистику активностей студента
  static async getStudentStats(req, res) {
    try {
      const { studentId } = req.params;
      const { subjectId } = req.query;
      
      const stats = await Activity.getStudentStats(studentId, subjectId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении статистики студента',
        error: error.message
      });
    }
  }

  static async updateLesson(req, res) {
    try {
      const { id } = req.params;
      const lesson = await Lesson.update(id, req.body);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Занятие не найдено'
        });
      }

      res.json({
        success: true,
        message: 'Занятие успешно обновлено',
        data: lesson
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении занятия',
        error: error.message
      });
    }
  }

  // Удалить занятие
  static async deleteLesson(req, res) {
    try {
      const { subjectId, subjectType, date } = req.params;
      const activity = await Lesson.delete(subjectId, subjectType, date);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Занятие не найдено'
        });
      }

      res.json({
        success: true,
        message: 'Занятие успешно удалено',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении занятия',
        error: error.message
      });
    }
  }

  // Удалить занятие по id
  static async deleteLessonById(req, res) {
    try {
      const { lessonId } = req.params;
      const activity = await Lesson.deleteById(lessonId);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Занятие не найдено'
        });
      }

      res.json({
        success: true,
        message: 'Занятие успешно удалено',
        data: activity
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении занятия',
        error: error.message
      });
    }
  }
}

export default GradeController;