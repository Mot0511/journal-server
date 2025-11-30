import pool from '../config/database.js';

class Group {
  constructor(id, title, number) {
    this.id = id;
    this.title = title;
    this.number = number;
  }

  // Получить все группы
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM "Group" ORDER BY "Title"');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching groups: ${error.message}`);
    }
  }

  // Получить группу по ID
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM "Group" WHERE "id" = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching group: ${error.message}`);
    }
  }

  // Создать новую группу
  static async create(groupData) {
    const { title, number } = groupData;
    try {
      const result = await pool.query(`
        INSERT INTO "Group" ("Title", "Number")
        VALUES ($1, $2)
        RETURNING *
      `, [title, number]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating group: ${error.message}`);
    }
  }

  // Обновить группу
  static async update(id, groupData) {
    const { title, number } = groupData;
    try {
      const result = await pool.query(`
        UPDATE "Group" 
        SET "Title" = $1, "Number" = $2
        WHERE "id" = $3
        RETURNING *
      `, [title, number, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating group: ${error.message}`);
    }
  }

  // Удалить группу
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM "Group" WHERE "id" = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting group: ${error.message}`);
    }
  }

  // Получить группу со студентами
  static async getGroupWithStudents(id) {
    try {
      const group = await this.findById(id);
      if (!group) return null;

      const students = await pool.query(`
        SELECT * FROM "Student" 
        WHERE "GroupId" = $1
        ORDER BY "LastName", "FirstName"
      `, [id]);

      return {
        ...group,
        students: students.rows
      };
    } catch (error) {
      throw new Error(`Error fetching group with students: ${error.message}`);
    }
  }

  // Получить предметы группы
  static async getGroupSubjects(groupId) {
    try {
      const result = await pool.query(`
        SELECT DISTINCT s.*, t."FirstName" as teacher_first_name, t."LastName" as teacher_last_name
        FROM "Subject" s
        JOIN "TeacherSubject" ts ON s."id" = ts."SubjectId"
        JOIN "Teacher" t ON ts."TeacherId" = t."id"
        WHERE ts."GroupId" = $1
        ORDER BY s."Title"
      `, [groupId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching group subjects: ${error.message}`);
    }
  }

  // Получить статистику группы
  static async getGroupStats(groupId) {
    try {
      // Количество студентов
      const studentsCount = await pool.query(`
        SELECT COUNT(*) as count FROM "Student" WHERE "GroupId" = $1
      `, [groupId]);

      // Количество предметов
      const subjectsCount = await pool.query(`
        SELECT COUNT(DISTINCT "SubjectId") as count 
        FROM "TeacherSubject" WHERE "GroupId" = $1
      `, [groupId]);

      // Средний балл группы (из активностей)
      const avgMark = await pool.query(`
        SELECT AVG(CAST(a."Mark" AS NUMERIC)) as avg_mark
        FROM "Activity" a
        JOIN "Student" s ON a."StudentId" = s."id"
        WHERE s."GroupId" = $1 AND a."Mark" ~ '^[0-9]+$'
      `, [groupId]);

      return {
        studentsCount: parseInt(studentsCount.rows[0].count),
        subjectsCount: parseInt(subjectsCount.rows[0].count),
        avgMark: parseFloat(avgMark.rows[0].avg_mark) || 0
      };
    } catch (error) {
      throw new Error(`Error fetching group stats: ${error.message}`);
    }
  }
}

export default Group;