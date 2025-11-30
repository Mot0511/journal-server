import pool from '../config/database.js';

class Teacher {
  constructor(id, login, password, lastName, firstName, middleName, vystsumMail, vkId, tgId) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.lastName = lastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.vystsumMail = vystsumMail;
    this.vkId = vkId;
    this.tgId = tgId;
  }

  // Получить всех преподавателей
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM "Teacher" ORDER BY "LastName", "FirstName"');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching teachers: ${error.message}`);
    }
  }

  // Получить преподавателя по ID
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM "Teacher" WHERE "id" = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching teacher: ${error.message}`);
    }
  }

  // Получить преподавателя по логину
  static async findByLogin(login) {
    try {
      const result = await pool.query('SELECT * FROM "Teacher" WHERE "Login" = $1', [login]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching teacher by login: ${error.message}`);
    }
  }

  // Создать нового преподавателя
  static async create(teacherData) {
    const { login, password, lastName, firstName, middleName, vystsumMail, vkId, tgId } = teacherData;
    try {
      const result = await pool.query(`
        INSERT INTO "Teacher" ("Login", "Password", "LastName", "FirstName", "MiddleName", "vyatsu_mail", "vk_id", "tg_id")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [login, password, lastName, firstName, middleName, vystsumMail, vkId, tgId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating teacher: ${error.message}`);
    }
  }

  // Обновить преподавателя
  static async update(id, teacherData) {
    const { login, lastName, firstName, middleName, vystsumMail, vkId, tgId } = teacherData;
    try {
      const result = await pool.query(`
        UPDATE "Teacher" 
        SET "Login" = $1, "LastName" = $2, "FirstName" = $3, "MiddleName" = $4, 
            "vystsu_mail" = $5, "vk_id" = $6, "tg_id" = $7
        WHERE "id" = $8
        RETURNING *
      `, [login, lastName, firstName, middleName, vystsumMail, vkId, tgId, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating teacher: ${error.message}`);
    }
  }

  // Удалить преподавателя
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM "Teacher" WHERE "id" = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting teacher: ${error.message}`);
    }
  }

  // Получить предметы и группы преподавателя
  static async getTeacherSubjects(teacherId) {
    try {
      const result = await pool.query(`
        SELECT ts.*, s."Title" as subject_title, g."Title" as group_title, g."Number" as group_number
        FROM "TeacherSubject" ts
        LEFT JOIN "Subject" s ON ts."SubjectId" = s."id"
        LEFT JOIN "Group" g ON ts."GroupId" = g."id"
        WHERE ts."TeacherId" = $1
        ORDER BY s."Title", g."Title"
      `, [teacherId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching teacher subjects: ${error.message}`);
    }
  }

  // Получить студентов преподавателя по предмету
  static async getStudentsBySubject(teacherId, subjectId, groupId = null) {
    try {
      let query = `
        SELECT DISTINCT s.*, g."Title" as group_title, g."Number" as group_number
        FROM "Student" s
        JOIN "Group" g ON s."GroupId" = g."id"
        JOIN "TeacherSubject" ts ON ts."GroupId" = g."id"
        WHERE ts."TeacherId" = $1 AND ts."SubjectId" = $2
      `;
      
      const params = [teacherId, subjectId];
      
      if (groupId) {
        query += ' AND g."id" = $3';
        params.push(groupId);
      }
      
      query += ' ORDER BY s."LastName", s."FirstName"';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching teacher's students: ${error.message}`);
    }
  }

  // Получить активности студентов для преподавателя
  static async getStudentActivities(teacherId, subjectId, groupId = null) {
    try {
      let query = `
        SELECT a.*, s."FirstName" as student_first_name, s."LastName" as student_last_name,
               sub."Title" as subject_title, tt."Title" as task_type_title,
               t."Meta" as task_meta, g."Title" as group_title
        FROM "Activity" a
        JOIN "Student" s ON a."StudentId" = s."id"
        JOIN "Group" g ON s."GroupId" = g."id"
        JOIN "Subject" sub ON a."SubjectId" = sub."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeld" = tt."id"
        LEFT JOIN "Task" t ON a."TaskId" = t."id"
        WHERE a."TeacherId" = $1 AND a."SubjectId" = $2
      `;
      
      const params = [teacherId, subjectId];
      
      if (groupId) {
        query += ' AND s."GroupId" = $3';
        params.push(groupId);
      }
      
      query += ' ORDER BY a."Date" DESC, s."LastName", s."FirstName"';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching student activities: ${error.message}`);
    }
  }
}

export default Teacher;