import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { CreateUserInput } from '../schemas/user.schema';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from('users')
    .insert([{ ...rest, password: hashedPassword }])
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function findUserByEmail(email: string) {
  const { data: user } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();

  return user;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
