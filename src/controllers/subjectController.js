import Subject from '../models/Subject.js';

class SubjectController {
  // Получить все предметы
  static async getAllSubjects(req, res) {
    try {
      const subjects = await Subject.findAll();
      res.json({
        success: true,
        data: subjects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении предметов',
        error: error.message
      });
    }
  }

  // Получить предмет по ID
  static async getSubjectById(req, res) {
    try {
      const { id } = req.params;
      const subject = await Subject.findById(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Предмет не найден'
        });
      }

      res.json({
        success: true,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении предмета',
        error: error.message
      });
    }
  }

  // Получить преподавателей предмета
  static async getSubjectTeachers(req, res) {
    try {
      const { id } = req.params;
      const teachers = await Subject.getSubjectTeachers(id);
      
      res.json({
        success: true,
        data: teachers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении преподавателей предмета',
        error: error.message
      });
    }
  }

  // Получить группы, изучающие предмет
  static async getSubjectGroups(req, res) {
    try {
      const { id } = req.params;
      const groups = await Subject.getSubjectGroups(id);
      
      res.json({
        success: true,
        data: groups
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении групп предмета',
        error: error.message
      });
    }
  }

  // Создать новый предмет
  static async createSubject(req, res) {
    try {
      const subject = await Subject.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Предмет успешно создан',
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании предмета',
        error: error.message
      });
    }
  }

  // Обновить предмет
  static async updateSubject(req, res) {
    try {
      const { id } = req.params;
      const subject = await Subject.update(id, req.body);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Предмет не найден'
        });
      }

      res.json({
        success: true,
        message: 'Предмет успешно обновлен',
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении предмета',
        error: error.message
      });
    }
  }

  // Удалить предмет
  static async deleteSubject(req, res) {
    try {
      const { id } = req.params;
      const subject = await Subject.delete(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Предмет не найден'
        });
      }

      res.json({
        success: true,
        message: 'Предмет успешно удален',
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении предмета',
        error: error.message
      });
    }
  }
}

export default SubjectController;