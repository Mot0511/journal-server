import Group from '../models/Group.js';

class GroupController {
  // Получить все группы
  static async getAllGroups(req, res) {
    try {
      const groups = await Group.findAll();
      res.json({
        success: true,
        data: groups
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении групп',
        error: error.message
      });
    }
  }

  // Получить группу по ID
  static async getGroupById(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.findById(id);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Группа не найдена'
        });
      }

      res.json({
        success: true,
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении группы',
        error: error.message
      });
    }
  }

  // Получить группу со студентами
  static async getGroupWithStudents(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.getGroupWithStudents(id);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Группа не найдена'
        });
      }

      res.json({
        success: true,
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении группы со студентами',
        error: error.message
      });
    }
  }

  // Получить предметы группы
  static async getGroupSubjects(req, res) {
    try {
      const { id } = req.params;
      const subjects = await Group.getGroupSubjects(id);
      
      res.json({
        success: true,
        data: subjects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении предметов группы',
        error: error.message
      });
    }
  }

  // Получить статистику группы
  static async getGroupStats(req, res) {
    try {
      const { id } = req.params;
      const stats = await Group.getGroupStats(id);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении статистики группы',
        error: error.message
      });
    }
  }

  // Создать новую группу
  static async createGroup(req, res) {
    try {
      const group = await Group.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Группа успешно создана',
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании группы',
        error: error.message
      });
    }
  }

  // Обновить группу
  static async updateGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.update(id, req.body);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Группа не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Группа успешно обновлена',
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении группы',
        error: error.message
      });
    }
  }

  // Удалить группу
  static async deleteGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.delete(id);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Группа не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Группа успешно удалена',
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении группы',
        error: error.message
      });
    }
  }
}

export default GroupController;