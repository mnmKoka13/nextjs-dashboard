import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; 

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

//このタスクに Middleware を使用する利点は、Middleware が認証を確認するまで
// 保護されたルートのレンダリングが開始されないため、アプリケーションのセキュリティと
// パフォーマンスの両方が向上することです。