# Примеры запросов к API

Вот примеры запросов для тестирования API в различных инструментах (Postman, curl, etc.)

## Авторизация

### Логин студента
```bash
curl -X POST http://localhost:3000/api/auth/login/student \
  -H "Content-Type: application/json" \
  -d '{
    "login": "student_login",
    "password": "password"
  }'
```

### Логин преподавателя
```bash
curl -X POST http://localhost:3000/api/auth/login/teacher \
  -H "Content-Type: application/json" \
  -d '{
    "login": "teacher_login",
    "password": "password"
  }'
```

## Студенты

### Получить всех студентов (преподаватель)
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Получить студентов группы
```bash
curl -X GET http://localhost:3000/api/students/group/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Создать студента
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "new_student",
    "password": "password123",
    "lastName": "Иванов",
    "firstName": "Иван",
    "middleName": "Иванович",
    "groupId": 1,
    "vyatsuMail": "ivan@vyatsu.ru"
  }'
```

## Группы

### Получить все группы
```bash
curl -X GET http://localhost:3000/api/groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Создать группу
```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ИВТб-1301-05-00",
    "number": "1301"
  }'
```

## Оценки и активности

### Получить активности журнала
```bash
curl -X GET "http://localhost:3000/api/grades/activities/journal?teacherId=1&subjectId=1&groupId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Создать активность
```bash
curl -X POST http://localhost:3000/api/grades/activities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subjectId": 1,
    "teacherId": 1,
    "taskId": null,
    "taskTypeId": 1,
    "meta": "Домашнее задание",
    "date": "2023-10-30",
    "mark": "5"
  }'
```

### Создать занятие
```bash
curl -X POST http://localhost:3000/api/grades/lessons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subjectId": 1,
    "typeSubject": 1,
    "mark": "Н",
    "date": "2023-10-30"
  }'
```

### Массовое создание занятий для группы
```bash
curl -X POST http://localhost:3000/api/grades/lessons/bulk \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": 1,
    "subjectId": 1,
    "typeSubjectId": 1,
    "date": "2023-10-30",
    "defaultMark": ""
  }'
```

## Предметы

### Получить все предметы
```bash
curl -X GET http://localhost:3000/api/subjects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Создать предмет
```bash
curl -X POST http://localhost:3000/api/subjects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Информатика"
  }'
```

## Статистика

### Статистика посещаемости студента
```bash
curl -X GET http://localhost:3000/api/grades/stats/attendance/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Статистика активностей студента
```bash
curl -X GET http://localhost:3000/api/grades/stats/student/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Проверка здоровья сервера

```bash
curl -X GET http://localhost:3000/api/health
```