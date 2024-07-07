import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

const adminEmails = process.env.ADMIN_EMAILS.split(", ");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const client = await clientPromise;
          const db = client.db();
          const admin = await db
            .collection("admins")
            .findOne({ email: credentials.email });

          if (!admin) {
            console.error("No user found");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            admin.hashedPassword
          );

          if (!isValid) {
            console.error("Invalid password");
            return null;
          }

          return {
            id: admin._id,
            email: admin.email,
            name: admin.username,
          };
        } catch (error) {
          console.error("Error validating credentials:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    async session({ session, token, user }) {
      console.log("session here");
      if (user?.email && adminEmails.includes(user.email)) {
        console.log("session true here");
        session.user = {
          email: user.email,
          name: user.name,
          id: user.id,
        };
        return session;
      } else {
        if (token) {
          return {
            ...session,
            id: token.id,
          };
        } else {
          return false;
        }
      }
    },

    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default (req, res) => NextAuth(req, res, authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
