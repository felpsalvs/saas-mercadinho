import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from '../controllers/auth.controller';
import { $ref } from '../schemas/user.schema';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      body: $ref('userSchema'),
      response: {
        201: $ref('userResponseSchema'),
      },
    },
  }, registerHandler);

  app.post('/login', {
    schema: {
      body: $ref('loginSchema'),
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
  }, loginHandler);
}
