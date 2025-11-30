import Joi from 'joi';

// Middleware для валидации запросов
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Схемы валидации для аутентификации
export const loginSchema = Joi.object({
  login: Joi.string().required().messages({
    'string.empty': 'Логин не может быть пустым',
    'any.required': 'Логин обязателен'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Пароль не может быть пустым',
    'string.min': 'Пароль должен быть не менее 6 символов',
    'any.required': 'Пароль обязателен'
  })
});

// Схема для регистрации студента
export const studentRegistrationSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().min(6).required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  middleName: Joi.string().allow('', null),
  groupId: Joi.number().integer().required(),
  vkId: Joi.string().allow('', null),
  tgId: Joi.string().allow('', null),
  vyatsuMail: Joi.string().email().allow('', null)
});

// Схема для регистрации преподавателя
export const teacherRegistrationSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().min(6).required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  middleName: Joi.string().allow('', null),
  vystsumMail: Joi.string().email().allow('', null),
  vkId: Joi.string().allow('', null),
  tgId: Joi.string().allow('', null)
});

// Схема для создания группы
export const groupSchema = Joi.object({
  title: Joi.string().required(),
  number: Joi.string().required()
});

// Схема для создания предмета
export const subjectSchema = Joi.object({
  title: Joi.string().required()
});

// Схема для создания активности
export const activitySchema = Joi.object({
  studentId: Joi.number().integer().required(),
  subjectId: Joi.number().integer().required(),
  teacherId: Joi.number().integer().required(),
  taskId: Joi.number().integer().allow(null),
  taskTypeId: Joi.number().integer().allow(null),
  meta: Joi.string().allow('', null),
  date: Joi.date().required(),
  mark: Joi.string().required(),
  taskNumber: Joi.number().required(),
  number: Joi.number().required()
});

// Схема для создания занятия
export const lessonSchema = Joi.object({
  studentId: Joi.number().integer().required(),
  subjectId: Joi.number().integer().required(),
  typeSubject: Joi.number().integer().required(),
  mark: Joi.string().required(),
  date: Joi.date().required()
});

// Схема для изменения пароля
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});