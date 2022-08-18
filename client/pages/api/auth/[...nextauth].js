import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_URI
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.id_token;
      }

      if (profile) {
        token.role = profile['https://hasura.io/jwt/claims']['x-hasura-role'];
        token.email_verified = profile['email_verified'];
      }

      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = token.role;
      session.emailVerified = token.email_verified;

      return session;
    }
  }
});
