import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, LoginInput } from '../schemas/user.schema';
import { createUser, findUserByEmail, verifyPassword } from '../services/user.service';

export async function registerHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  try {
    const user = await createUser(request.body);
    return reply.code(201).send(user);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return reply.code(401).send({ message: 'Invalid email or password' });
  }

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    return reply.code(401).send({ message: 'Invalid email or password' });
  }

  const token = await reply.jwtSign({
    id: user.id,
    email: user.email,
  });

  return { token };
}
