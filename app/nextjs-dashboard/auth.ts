import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (err) {
    console.error('Failed to fetch user:', err);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // クレデンシャルプロバイダは、ユーザがユーザ名とパスワードでログインできるようにする。
  providers: [
    credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            return null;
          }

          const passwordsMathc = await bcrypt.compare(password, user.password);
          if (passwordsMathc) {
            return user;
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});