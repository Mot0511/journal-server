import pool from '../config/database.js';

class Activity {
  constructor(studentId, subjectId, teacherId, taskId, taskTypeId, meta, date, mark) {
    this.studentId = studentId;
    this.subjectId = subjectId;
    this.teacherId = teacherId;
    this.taskId = taskId;
    this.taskTypeId = taskTypeId;
    this.meta = meta;
    this.date = date;
    this.mark = mark;
  }

  // Получить все активности
  static async findAll(limit = 100, offset = 0) {
    try {
      const result = await pool.query(`
        SELECT a.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name,
               sub."Title" as subject_title,
               t."FirstName" as teacher_first_name, t."LastName" as teacher_last_name,
               tt."Title" as task_type_title,
               tk."Meta" as task_meta
        FROM "Activity" a
        LEFT JOIN "Student" s ON a."StudentId" = s."id"
        LEFT JOIN "Subject" sub ON a."SubjectId" = sub."id"
        LEFT JOIN "Teacher" t ON a."TeacherId" = t."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeld" = tt."id"
        LEFT JOIN "Task" tk ON a."TaskId" = tk."id"
        ORDER BY a."Date" DESC, s."LastName", s."FirstName"
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
    }
  }

  // Получить активности студента
  static async findByStudentId(studentId) {
    try {
      const result = await pool.query(`
        SELECT a.*, 
               sub."Title" as subject_title,
               t."FirstName" as teacher_first_name, t."LastName" as teacher_last_name,
               tt."Title" as task_type_title,
               tk."Meta" as task_meta
        FROM "Activity" a
        LEFT JOIN "Subject" sub ON a."SubjectId" = sub."id"
        LEFT JOIN "Teacher" t ON a."TeacherId" = t."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeld" = tt."id"
        LEFT JOIN "Task" tk ON a."TaskId" = tk."id"
        WHERE a."StudentId" = $1
        ORDER BY a."Date" DESC
      `, [studentId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching student activities: ${error.message}`);
    }
  }

  // Получить активности по предмету
  static async findBySubjectId(subjectId) {
    try {
      const result = await pool.query(`
        SELECT a.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name,
               sub."Title" as subject_title,
               t."FirstName" as teacher_first_name, t."LastName" as teacher_last_name,
               tt."Title" as task_type_title,
               tk."Meta" as task_meta
        FROM "Activity" a
        LEFT JOIN "Student" s ON a."StudentId" = s."id"
        LEFT JOIN "Subject" sub ON a."SubjectId" = sub."id"
        LEFT JOIN "Teacher" t ON a."TeacherId" = t."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeld" = tt."id"
        LEFT JOIN "Task" tk ON a."TaskId" = tk."id"
        WHERE a."SubjectId" = $1
        ORDER BY a."Date" DESC, s."LastName", s."FirstName"
      `, [subjectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching subject activities: ${error.message}`);
    }
  }

  // Создать новую активность
  static async create(activityData) {
    const { studentId, subjectId, teacherId, taskId, taskTypeId, meta, date, mark, taskNumber, number } = activityData;
    try {
      const result = await pool.query(`
        INSERT INTO "Activity" ("StudentId", "SubjectId", "TeacherId", "TaskId", "TaskTypeId", "Meta", "Date", "Mark", "TaskNumber", "Number")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [studentId, subjectId, teacherId, taskId, taskTypeId, meta, date, mark, taskNumber, number]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating activity: ${error.message}`);
    }
  }

  // Обновить активность
  static async update(id, activityData) {
    const { taskId, taskTypeId, meta, mark } = activityData;
    try {
      const result = await pool.query(`
        UPDATE "Activity" 
        SET "TaskId" = $1, "TaskTypeId" = $2, "Meta" = $3, "Mark" = $4
        WHERE "id" = $5
        RETURNING *
      `, [taskId, taskTypeId, meta, mark, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating activity: ${error.message}`);
    }
  }

  // Удалить активность
  static async delete(id) {
    try {
      const result = await pool.query(`
        DELETE FROM "Activity" 
        WHERE "id" = $1
        RETURNING *
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting activity: ${error.message}`);
    }
  }

  static async deleteLab(id) {
    try {
      const result = await pool.query(`
        DELETE FROM "Activity" 
        WHERE "TaskId" = $1
        RETURNING *
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting lab: ${error.message}`);
    }
  }

  // Получить активности для журнала (по преподавателю и предмету)
  static async getJournalActivities(teacherId, subjectId, groupId = null) {
    try {
      let query = `
        SELECT a.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name, s."id" as student_id,
               g."Title" as group_title, g."Number" as group_number,
               sub."Title" as subject_title,
               tt."Title" as task_type_title,
               tk."Meta" as task_meta
        FROM "Activity" a
        JOIN "Student" s ON a."StudentId" = s."id"
        JOIN "Group" g ON s."GroupId" = g."id"
        JOIN "Subject" sub ON a."SubjectId" = sub."id"
        LEFT JOIN "TaskType" tt ON a."TaskTypeId" = tt."id"
        LEFT JOIN "Task" tk ON a."TaskId" = tk."id"
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
      throw new Error(`Error fetching journal activities: ${error.message}`);
    }
  }

  // Получить статистику активностей студента
  static async getStudentStats(studentId, subjectId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_activities,
          COUNT(CASE WHEN "Mark" ~ '^[4-5]$' THEN 1 END) as good_marks,
          COUNT(CASE WHEN "Mark" ~ '^[1-3]$' THEN 1 END) as bad_marks,
          AVG(CASE WHEN "Mark" ~ '^[0-9]+$' THEN CAST("Mark" AS NUMERIC) END) as avg_mark
        FROM "Activity"
        WHERE "StudentId" = $1
      `;
      
      const params = [studentId];
      
      if (subjectId) {
        query += ' AND "SubjectId" = $2';
        params.push(subjectId);
      }
      
      const result = await pool.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching student stats: ${error.message}`);
    }
  }
}

export default Activity;