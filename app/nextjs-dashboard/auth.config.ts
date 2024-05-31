import type { NextAuthConfig } from "next-auth";
import { signIn } from "next-auth/react";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
};