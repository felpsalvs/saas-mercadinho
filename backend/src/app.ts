import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { userRoutes } from './routes/user.routes';
import { authRoutes } from './routes/auth.routes';

export const buildServer = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: true,
  });

  // Registra plugins
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret',
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Registra rotas
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(userRoutes, { prefix: '/api/users' });

  return app;
};
