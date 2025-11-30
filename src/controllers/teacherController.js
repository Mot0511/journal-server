import Teacher from '../models/Teacher.js';

class TeacherController {
  // Получить всех преподавателей
  static async getAllTeachers(req, res) {
    try {
      const teachers = await Teacher.findAll();
      res.json({
        success: true,
        data: teachers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении преподавателей',
        error: error.message
      });
    }
  }

  // Получить преподавателя по ID
  static async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findById(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Преподаватель не найден'
        });
      }

      // Убрать пароль из ответа
      const { Password, ...teacherData } = teacher;

      res.json({
        success: true,
        data: teacherData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении преподавателя',
        error: error.message
      });
    }
  }

  // Получить предметы и группы преподавателя
  static async getTeacherSubjects(req, res) {
    try {
      const { id } = req.params;
      const subjects = await Teacher.getTeacherSubjects(id);
      
      res.json({
        success: true,
        data: subjects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении предметов преподавателя',
        error: error.message
      });
    }
  }

  // Получить студентов преподавателя по предмету
  static async getTeacherStudents(req, res) {
    try {
      const { id } = req.params;
      const { subjectId, groupId } = req.query;
      
      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: 'ID предмета обязателен'
        });
      }

      const students = await Teacher.getStudentsBySubject(id, subjectId, groupId);
      
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студентов преподавателя',
        error: error.message
      });
    }
  }

  // Получить активности студентов для преподавателя
  static async getStudentActivities(req, res) {
    try {
      const { id } = req.params;
      const { subjectId, groupId } = req.query;
      
      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: 'ID предмета обязателен'
        });
      }

      const activities = await Teacher.getStudentActivities(id, subjectId, groupId);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активностей студентов',
        error: error.message
      });
    }
  }

  // Получить информацию о текущем преподавателе
  static async getCurrentTeacher(req, res) {
    try {
      const { id, role } = req.user;
      
      if (role !== 'teacher') {
        return res.status(403).json({
          success: false,
          message: 'Доступ запрещен'
        });
      }

      const teacher = await Teacher.findById(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Преподаватель не найден'
        });
      }

      // Убрать пароль из ответа
      const { Password, ...teacherData } = teacher;

      // Получить предметы преподавателя
      const subjects = await Teacher.getTeacherSubjects(id);

      res.json({
        success: true,
        data: {
          ...teacherData,
          subjects
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении информации о преподавателе',
        error: error.message
      });
    }
  }

  // Обновить преподавателя
  static async updateTeacher(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.update(id, req.body);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Преподаватель не найден'
        });
      }

      // Убрать пароль из ответа
      const { Password, ...teacherData } = teacher;

      res.json({
        success: true,
        message: 'Преподаватель успешно обновлен',
        data: teacherData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении преподавателя',
        error: error.message
      });
    }
  }

  // Удалить преподавателя
  static async deleteTeacher(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.delete(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Преподаватель не найден'
        });
      }

      res.json({
        success: true,
        message: 'Преподаватель успешно удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении преподавателя',
        error: error.message
      });
    }
  }
}

export default TeacherController;