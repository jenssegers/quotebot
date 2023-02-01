import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }): Promise<boolean> {
      if (account && account.provider === "google") {
        let googleProfile = profile as GoogleProfile;
        return (
          googleProfile.email_verified &&
          googleProfile.email.endsWith(
            `@${process.env.NEXT_PUBLIC_GOOGLE_DOMAIN}`
          )
        );
      }
      return false;
    },
  },
};

export default NextAuth(authOptions);
