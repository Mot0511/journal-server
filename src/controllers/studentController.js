import Student from '../models/Student.js';
import AuthController from './authController.js';
import bcrypt from 'bcryptjs';


const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

class StudentController {
  // Получить всех студентов (публичная версия - без авторизации)
  static async getAllStudentsPublic(req, res) {
    try {
      const students = await Student.findAllPublic();
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студентов',
        error: error.message
      });
    }
  }

  // Получить студентов по группе (публичная версия - без авторизации)
  static async getStudentsByGroupPublic(req, res) {
    try {
      const { groupId } = req.params;
      const students = await Student.findByGroupIdPublic(groupId);
      
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студентов группы',
        error: error.message
      });
    }
  }

  // Получить всех студентов (защищенная версия)
  static async getAllStudents(req, res) {
    try {
      const students = await Student.findAll();
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студентов',
        error: error.message
      });
    }
  }

  // Получить студента по ID
  static async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Студент не найден'
        });
      }

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студента',
        error: error.message
      });
    }
  }

  // Получить полную информацию о студенте (с активностями и занятиями)
  static async getStudentFullInfo(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.getStudentFullInfo(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Студент не найден'
        });
      }

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении информации о студенте',
        error: error.message
      });
    }
  }

  // Получить студентов по группе (защищенная версия)
  static async getStudentsByGroup(req, res) {
    try {
      const { groupId } = req.params;
      const students = await Student.findByGroupId(groupId);
      
      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении студентов группы',
        error: error.message
      });
    }
  }

  // Создать нового студента
  static async createStudent(req, res) {
    try {
      const { login, password, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail } = req.body;
      // Проверить, существует ли уже студент с таким логином
      const existingStudent = await Student.findByLogin(login);
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Студент с таким логином уже существует'
        });
      }

      // Хешировать пароль
      const hashedPassword = await hashPassword(password);
      // Создать нового студента
      const newStudent = await Student.create({
        login,
        password: hashedPassword,
        lastName,
        firstName,
        middleName,
        groupId,
        vkId,
        tgId,
        vyatsuMail
      });

      const { Password, ...studentData } = newStudent;
      
      res.status(201).json({
        success: true,
        message: 'Студент успешно создан',
        data: studentData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании студента',
        error: error.message
      });
    }
  }

  // Обновить студента
  static async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.update(id, req.body);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Студент не найден'
        });
      }

      res.json({
        success: true,
        message: 'Студент успешно обновлен',
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении студента',
        error: error.message
      });
    }
  }

  // Удалить студента
  static async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.delete(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Студент не найден'
        });
      }

      res.json({
        success: true,
        message: 'Студент успешно удален',
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении студента',
        error: error.message
      });
    }
  }

  // Получить информацию о текущем студенте (для авторизованного пользователя)
  static async getCurrentStudent(req, res) {
    try {
      const { id, role } = req.user;
      
      if (role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Доступ запрещен'
        });
      }

      const student = await Student.getStudentFullInfo(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Студент не найден'
        });
      }

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении информации о студенте',
        error: error.message
      });
    }
  }
}

export default StudentController;