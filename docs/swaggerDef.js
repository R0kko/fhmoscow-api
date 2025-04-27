export default {
  openapi: '3.0.3',
  info: {
    title: 'API для мобильного приложения Федерации хоккея Москвы',
    version: '1.0.0',
    description:
      'Документация формируется из JSDoc‑комментариев в коде и общих компонент',
  },

  servers: [{ url: 'http://localhost:3000', description: 'Локальная машина' }],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },

    responses: {
      BadRequest: {
        description: 'Некорректные данные запроса',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Некорректные входные данные',
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      msg: { type: 'string' },
                      param: { type: 'string' },
                      location: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      Unauthorized: {
        description: 'Отсутствует токен или он недействителен',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Неверный или истёкший токен',
                },
              },
            },
          },
        },
      },

      NotFound: {
        description: 'Ресурс не найден',
      },
    },

    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a70d6605-0f0d-4fa5-b8d4-82c0d3b7a120',
          },
          first_name: { type: 'string', example: 'Алексей' },
          last_name: { type: 'string', example: 'Иванов' },
          middle_name: { type: 'string', example: 'Сергеевич' },
          email: { type: 'string', format: 'email', example: 'user@mail.ru' },
          phone: { type: 'string', example: '79001234567' },
          date_of_birth: {
            type: 'string',
            format: 'date',
            example: '1998-05-12',
          },
        },
      },

      UserUpdate: {
        allOf: [{ $ref: '#/components/schemas/User' }],
        description:
          'Все поля необязательны, можно отправлять частичный объект',
      },
    },
  },

  security: [{ bearerAuth: [] }],
};
