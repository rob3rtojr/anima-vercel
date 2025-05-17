
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const nextAuthOptions: NextAuthOptions = {
  session: {
    maxAge: 2 * 60 * 60 //2 horas
  },
  jwt: {
    maxAge: 2 * 60 * 60 //2 horas
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        id: { type: "text" },
        dataNascimento: { type: "text" },
        matricula: { type: "text" },
        nomeMae: { type: "text" },
        cpf: { type: "text" },
        masp: { type: "text" },
        matriculaProfessor: { type: "text" },
        email: { type: "text" },
        celular: { type: "text" },
        userType: { type: "text" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/autenticacao`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: credentials?.id,
            dataNascimento: credentials?.dataNascimento,
            matricula: credentials?.matricula,
            nomeMae: credentials?.nomeMae,
            cpf: credentials?.cpf,
            masp: credentials?.masp,
            matriculaProfessor: credentials?.matriculaProfessor,
            email: credentials?.email,
            celular: credentials?.celular,
            userType: credentials?.userType
          }),
        });

        const user = await res.json();

        if (user && res.ok) {
          return user;
        }

        return null;

      },
    }),
  ],
  callbacks: {

    async jwt({ token, user }) {

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },


  },
  pages: {
    signIn: `/`,
    signOut: '/auth/signout',
    error: "/auth/error"
  }
}

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
