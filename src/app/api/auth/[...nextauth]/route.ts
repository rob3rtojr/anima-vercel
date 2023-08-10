
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        id: { label: "Username", type: "text", placeholder: "jsmith" },
        dataNascimento: { label: "Password", type: "text" },
        matricula: {type:"text"},
        nomeMae: {type:"text"},
        cpf: {type:"text"},
        masp: {type:"text"},
        matriculaProfessor: {type:"text"},
        userType: {type:"text"}
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
            userType: credentials?.userType
          }),
        });

        const user = await res.json();

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
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
    signIn: `/auth/signin`,
    signOut: '/auth/signout',
    error: "/auth/error"
  }
});

export { handler as GET, handler as POST };
