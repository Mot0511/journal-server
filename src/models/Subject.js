import pool from '../config/database.js';

class Subject {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  // Получить все предметы
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM "Subject" ORDER BY "Title"');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching subjects: ${error.message}`);
    }
  }

  // Получить предмет по ID
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM "Subject" WHERE "id" = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching subject: ${error.message}`);
    }
  }

  // Создать новый предмет
  static async create(subjectData) {
    const { title } = subjectData;
    try {
      const result = await pool.query(`
        INSERT INTO "Subject" ("Title")
        VALUES ($1)
        RETURNING *
      `, [title]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating subject: ${error.message}`);
    }
  }

  // Обновить предмет
  static async update(id, subjectData) {
    const { title } = subjectData;
    try {
      const result = await pool.query(`
        UPDATE "Subject" 
        SET "Title" = $1
        WHERE "id" = $2
        RETURNING *
      `, [title, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating subject: ${error.message}`);
    }
  }

  // Удалить предмет
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM "Subject" WHERE "id" = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting subject: ${error.message}`);
    }
  }

  // Получить преподавателей предмета
  static async getSubjectTeachers(subjectId) {
    try {
      const result = await pool.query(`
        SELECT DISTINCT t.*, g."Title" as group_title, g."Number" as group_number
        FROM "Teacher" t
        JOIN "TeacherSubject" ts ON t."id" = ts."TeacherId"
        JOIN "Group" g ON ts."GroupId" = g."id"
        WHERE ts."SubjectId" = $1
        ORDER BY t."LastName", t."FirstName"
      `, [subjectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching subject teachers: ${error.message}`);
    }
  }

  // Получить группы, изучающие предмет
  static async getSubjectGroups(subjectId) {
    try {
      const result = await pool.query(`
        SELECT DISTINCT g.*, t."FirstName" as teacher_first_name, t."LastName" as teacher_last_name
        FROM "Group" g
        JOIN "TeacherSubject" ts ON g."id" = ts."GroupId"
        JOIN "Teacher" t ON ts."TeacherId" = t."id"
        WHERE ts."SubjectId" = $1
        ORDER BY g."Title"
      `, [subjectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching subject groups: ${error.message}`);
    }
  }
}

export default Subject;