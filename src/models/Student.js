import pool from '../config/database.js';

class Student {
  constructor(id, login, password, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.lastName = lastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.groupId = groupId;
    this.vkId = vkId;
    this.tgId = tgId;
    this.vyatsuMail = vyatsuMail;
  }

  // Получить всех студентов (публичная версия - без приватных данных)
  static async findAllPublic() {
    try {
      const result = await pool.query(`
        SELECT 
          s."id", 
          s."LastName", 
          s."FirstName", 
          s."MiddleName",
          g."Title" as group_title, 
          g."Number" as group_number 
        FROM "Student" s 
        LEFT JOIN "Group" g ON s."GroupId" = g."id"
        ORDER BY s."LastName", s."FirstName"
      `);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching public students: ${error.message}`);
    }
  }

  // Получить студентов по группе (публичная версия - без приватных данных)
  static async findByGroupIdPublic(groupId) {
    try {
      const result = await pool.query(`
        SELECT 
          s."id", 
          s."LastName", 
          s."FirstName", 
          s."MiddleName",
          g."Title" as group_title, 
          g."Number" as group_number 
        FROM "Student" s 
        LEFT JOIN "Group" g ON s."GroupId" = g."id"
        WHERE s."GroupId" = $1
        ORDER BY s."LastName", s."FirstName"
      `, [groupId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching public students by group: ${error.message}`);
    }
  }

  // Получить всех студентов (полная версия с приватными данными)
  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT s.*, g."Title" as group_title, g."Number" as group_number 
        FROM "Student" s 
        LEFT JOIN "Group" g ON s."GroupId" = g."id"
        ORDER BY s."LastName", s."FirstName"
      `);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  // Получить студента по ID
  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT s.*, g."Title" as group_title, g."Number" as group_number 
        FROM "Student" s 
        LEFT JOIN "Group" g ON s."GroupId" = g."id"
        WHERE s."id" = $1
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  // Получить студента по логину
  static async findByLogin(login) {
    try {
      const result = await pool.query('SELECT * FROM "Student" WHERE "Login" = $1', [login]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching student by login: ${error.message}`);
    }
  }

  // Получить студентов по группе (полная версия с приватными данными)
  static async findByGroupId(groupId) {
    try {
      const result = await pool.query(`
        SELECT s.*, g."Title" as group_title, g."Number" as group_number 
        FROM "Student" s 
        LEFT JOIN "Group" g ON s."GroupId" = g."id"
        WHERE s."GroupId" = $1
        ORDER BY s."LastName", s."FirstName"
      `, [groupId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching students by group: ${error.message}`);
    }
  }

  // Создать нового студента
  static async create(studentData) {
    const { login, password, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail } = studentData;
    try {
      const result = await pool.query(`
        INSERT INTO "Student" ("Login", "Password", "LastName", "FirstName", "MiddleName", "GroupId", "vk_id", "tg_id", "vyatsu_mail")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [login, password, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  // Обновить студента
  static async update(id, studentData) {
    const { login, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail } = studentData;
    try {
      const result = await pool.query(`
        UPDATE "Student" 
        SET "Login" = $1, "LastName" = $2, "FirstName" = $3, "MiddleName" = $4, 
            "GroupId" = $5, "vk_id" = $6, "tg_id" = $7, "vyatsu_mail" = $8
        WHERE "id" = $9
        RETURNING *
      `, [login, lastName, firstName, middleName, groupId, vkId, tgId, vyatsuMail, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  // Удалить студента
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM "Student" WHERE "id" = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }

  // Получить полную информацию о студенте с активностями и занятиями
  static async getStudentFullInfo(studentId) {
    try {
      const student = await this.findById(studentId);
      if (!student) return null;

      // Получаем занятия студента
      const lessons = await pool.query(`
        SELECT l.*, s."Title" as subject_title, ts."Title" as type_title
        FROM "Lesson" l
        LEFT JOIN "Subject" s ON l."SubjectId" = s."id"
        LEFT JOIN "TypeSubject" ts ON l."TypeSubject" = ts."id"
        WHERE l."StudentId" = $1
        ORDER BY l."Date" DESC
      `, [studentId]);

      // Получаем активности студента
      const activities = await pool.query(`
        SELECT a.*, s."Title" as subject_title, t."Title" as task_type_title, 
               tk."Meta" as task_meta, teach."FirstName" as teacher_first_name,
               teach."LastName" as teacher_last_name
        FROM "Activity" a
        LEFT JOIN "Subject" s ON a."SubjectId" = s."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeId" = tt."id"
        LEFT JOIN "Task" tk ON a."TaskId" = tk."id"
        LEFT JOIN "Teacher" teach ON a."TeacherId" = teach."id"
        WHERE a."StudentId" = $1
        ORDER BY a."Date" DESC
      `, [studentId]);

      return {
        ...student,
        lessons: lessons.rows,
        activities: activities.rows
      };
    } catch (error) {
      throw new Error(`Error fetching student full info: ${error.message}`);
    }
  }
}

export default Student;