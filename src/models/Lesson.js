import pool from '../config/database.js';

class Lesson {
  constructor(studentId, subjectId, typeSubject, mark, date) {
    this.studentId = studentId;
    this.subjectId = subjectId;
    this.typeSubject = typeSubject;
    this.mark = mark;
    this.date = date;
  }

  // Получить все занятия
  static async findAll(limit = 100, offset = 0) {
    try {
      const result = await pool.query(`
        SELECT l.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name,
               sub."Title" as subject_title,
               ts."Title" as type_title
        FROM "Lesson" l
        LEFT JOIN "Student" s ON l."StudentId" = s."id"
        LEFT JOIN "Subject" sub ON l."SubjectId" = sub."id"
        LEFT JOIN "TypeSubject" ts ON l."TypeSubject" = ts."id"
        ORDER BY l."Date" DESC, s."LastName", s."FirstName"
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching lessons: ${error.message}`);
    }
  }

  // Получить занятия студента
  static async findByStudentId(studentId) {
    try {
      const result = await pool.query(`
        SELECT l.*, 
               sub."Title" as subject_title,
               ts."Title" as type_title
        FROM "Lesson" l
        LEFT JOIN "Subject" sub ON l."SubjectId" = sub."id"
        LEFT JOIN "TypeSubject" ts ON l."TypeSubject" = ts."id"
        WHERE l."StudentId" = $1
        ORDER BY l."Date" DESC
      `, [studentId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching student lessons: ${error.message}`);
    }
  }

  // Получить занятия по предмету
  static async findBySubjectId(subjectId) {
    try {
      const result = await pool.query(`
        SELECT l.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name,
               sub."Title" as subject_title,
               ts."Title" as type_title
        FROM "Lesson" l
        LEFT JOIN "Student" s ON l."StudentId" = s."id"
        LEFT JOIN "Subject" sub ON l."SubjectId" = sub."id"
        LEFT JOIN "TypeSubject" ts ON l."TypeSubject" = ts."id"
        WHERE l."SubjectId" = $1
        ORDER BY l."Date" DESC, s."LastName", s."FirstName"
      `, [subjectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching subject lessons: ${error.message}`);
    }
  }

  // Создать новое занятие/посещение
  static async create(lessonData) {
    const { studentId, subjectId, typeSubject, mark, date } = lessonData;
    try {
      const result = await pool.query(`
        INSERT INTO "Lesson" ("StudentId", "SubjectId", "TypeSubject", "Mark", "Date")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [studentId, subjectId, typeSubject, mark, date]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating lesson: ${error.message}`);
    }
  }

  // Обновить занятие
  static async update(id, lessonData) {
    const { typeSubject, mark, date } = lessonData;
    try {
      const result = await pool.query(`
        UPDATE "Lesson" 
        SET "TypeSubject" = $1, "Mark" = $2, "Date" = $3
        WHERE "id" = $4
        RETURNING *
      `, [typeSubject, mark, date, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating lesson: ${error.message}`);
    }
  }

  // Удалить занятие
  static async delete(subjectId, subjectType, date) {
    try {
      const result = await pool.query(`
        DELETE FROM "Lesson" 
        WHERE "SubjectId" = $1 AND "TypeSubject" = $2 AND "Date" = $3
        RETURNING *
      `, [subjectId, subjectType, date]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting lesson: ${error.message}`);
    }
  }

  static async deleteById(lessonId) {
    try {
      const result = await pool.query(`
        DELETE FROM "Lesson" 
        WHERE "id" = $1
        RETURNING *
      `, [lessonId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting lesson: ${error.message}`);
    }
  }

  // Получить посещаемость студента
  static async getAttendanceStats(studentId, subjectId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_lessons,
          COUNT(CASE WHEN "Mark" != 'Н' AND "Mark" != '' THEN 1 END) as attended,
          COUNT(CASE WHEN "Mark" = 'Н' THEN 1 END) as missed
        FROM "Lesson"
        WHERE "StudentId" = $1
      `;
      
      const params = [studentId];
      
      if (subjectId) {
        query += ' AND "SubjectId" = $2';
        params.push(subjectId);
      }
      
      const result = await pool.query(query, params);
      const stats = result.rows[0];
      
      return {
        total: parseInt(stats.total_lessons),
        attended: parseInt(stats.attended),
        missed: parseInt(stats.missed),
        attendanceRate: stats.total_lessons > 0 ? (stats.attended / stats.total_lessons * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw new Error(`Error fetching attendance stats: ${error.message}`);
    }
  }

  // Получить занятия для журнала (сгруппированные по датам)
  static async getJournalLessons(subjectId, groupId = null, typeSubjectId = null) {
    try {
      let query = `
        SELECT l.*, 
               s."FirstName" as student_first_name, s."LastName" as student_last_name, s."id" as student_id,
               g."Title" as group_title, g."Number" as group_number,
               sub."Title" as subject_title,
               ts."Title" as type_title
        FROM "Lesson" l
        JOIN "Student" s ON l."StudentId" = s."id"
        JOIN "Group" g ON s."GroupId" = g."id"
        JOIN "Subject" sub ON l."SubjectId" = sub."id"
        LEFT JOIN "TypeSubject" ts ON l."TypeSubject" = ts."id"
        WHERE l."SubjectId" = $1
      `;
      
      const params = [subjectId];
      
      if (groupId) {
        query += ' AND s."GroupId" = $2';
        params.push(groupId);
      }
      
      if (typeSubjectId) {
        const paramIndex = params.length + 1;
        query += ` AND l."TypeSubject" = $${paramIndex}`;
        params.push(typeSubjectId);
      }
      
      query += ' ORDER BY l."Date" DESC, s."LastName", s."FirstName"';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching journal lessons: ${error.message}`);
    }
  }

  // Массовое добавление занятий для группы
  static async createBulkForGroup(groupId, subjectId, typeSubjectId, date, defaultMark = '') {
    try {
      const students = await pool.query('SELECT "id" FROM "Student" WHERE "GroupId" = $1', [groupId]);
      
      const insertPromises = students.rows.map(student => 
        this.create({
          studentId: student.id,
          subjectId,
          typeSubject: typeSubjectId,
          mark: defaultMark,
          date
        })
      );
      
      const results = await Promise.all(insertPromises);
      return results;
    } catch (error) {
      throw new Error(`Error creating bulk lessons: ${error.message}`);
    }
  }
}

export default Lesson;