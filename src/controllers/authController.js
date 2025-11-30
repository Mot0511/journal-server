import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Генерация JWT токена
const generateToken = (user, role) => {
  return jwt.sign(
    { 
      id: user.id, 
      login: user.Login, 
      role: role,
      name: `${user.FirstName} ${user.LastName}`
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Хеширование пароля
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Проверка пароля
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

class AuthController {
  // Логин студента
  static async loginStudent(req, res) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: 'Логин и пароль обязательны'
        });
      }

      // Найти студента по логину
      const student = await Student.findByLogin(login);
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Неверный логин или пароль'
        });
      }

      // Проверить пароль
      const isPasswordValid = await comparePassword(password, student.Password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Неверный логин или пароль'
        });
      }

      // Генерировать токен
      const token = generateToken(student, 'student');

      // Убрать пароль из ответа
      const { Password, ...studentData } = student;

      res.json({
        success: true,
        message: 'Авторизация успешна',
        data: {
          user: studentData,
          token,
          role: 'student'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Логин преподавателя
  static async loginTeacher(req, res) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: 'Логин и пароль обязательны'
        });
      }

      // Найти преподавателя по логину
      const teacher = await Teacher.findByLogin(login);
      if (!teacher) {
        return res.status(401).json({
          success: false,
          message: 'Неверный логин или пароль'
        });
      }

      // Проверить пароль
      const isPasswordValid = await comparePassword(password, teacher.Password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Неверный логин или пароль'
        });
      }

      // Генерировать токен
      const token = generateToken(teacher, 'teacher');

      // Убрать пароль из ответа
      const { Password, ...teacherData } = teacher;
      res.json({
        success: true,
        message: 'Авторизация успешна',
        data: {
          user: teacherData,
          token,
          role: 'teacher'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Регистрация нового студента (только для администраторов/преподавателей)
  static async registerStudent(req, res) {
    try {
      const { login, password, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail } = req.body;

      if (!login || !password || !lastName || !firstName || !groupId) {
        return res.status(400).json({
          success: false,
          message: 'Обязательные поля: логин, пароль, фамилия, имя, группа'
        });
      }

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

      // Убрать пароль из ответа
      const { Password, ...studentData } = newStudent;

      res.status(201).json({
        success: true,
        message: 'Студент успешно зарегистрирован',
        data: studentData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Регистрация нового преподавателя (только для администраторов)
  static async registerTeacher(req, res) {
    try {
      const { login, password, lastName, firstName, middleName, vystsumMail, vkId, tgId } = req.body;

      if (!login || !password || !lastName || !firstName) {
        return res.status(400).json({
          success: false,
          message: 'Обязательные поля: логин, пароль, фамилия, имя'
        });
      }

      // Проверить, существует ли уже преподаватель с таким логином
      const existingTeacher = await Teacher.findByLogin(login);
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Преподаватель с таким логином уже существует'
        });
      }

      // Хешировать пароль
      const hashedPassword = await hashPassword(password);

      // Создать нового преподавателя
      const newTeacher = await Teacher.create({
        login,
        password: hashedPassword,
        lastName,
        firstName,
        middleName,
        vystsumMail,
        vkId,
        tgId
      });

      // Убрать пароль из ответа
      const { Password, ...teacherData } = newTeacher;

      res.status(201).json({
        success: true,
        message: 'Преподаватель успешно зарегистрирован',
        data: teacherData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Получить информацию о текущем пользователе
  static async getMe(req, res) {
    try {
      const { id, role } = req.user;

      let user;
      if (role === 'student') {
        user = await Student.findById(id);
      } else if (role === 'teacher') {
        user = await Teacher.findById(id);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }

      // Убрать пароль из ответа
      const { Password, ...userData } = user;

      res.json({
        success: true,
        data: {
          user: userData,
          role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Изменить пароль
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const { id, role } = req.user;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Текущий и новый пароли обязательны'
        });
      }

      // Найти пользователя
      let user;
      if (role === 'student') {
        user = await Student.findById(id);
      } else if (role === 'teacher') {
        user = await Teacher.findById(id);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }

      // Проверить текущий пароль
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.Password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Неверный текущий пароль'
        });
      }

      // Хешировать новый пароль
      const hashedNewPassword = await hashPassword(newPassword);

      // Обновить пароль в базе данных
      // TODO: Добавить метод updatePassword в модели

      res.json({
        success: true,
        message: 'Пароль успешно изменен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message
      });
    }
  }

  // Выход (очистка токена на клиенте)
  static async logout(req, res) {
    res.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
  }
}

export default AuthController;