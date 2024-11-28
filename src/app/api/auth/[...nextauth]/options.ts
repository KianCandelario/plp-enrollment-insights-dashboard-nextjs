import 'next-auth';
import 'next-auth/jwt';
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import db from "@/app/utilities/firebase/firestore";
import { DefaultSession, NextAuthOptions } from "next-auth";

// Type extensions
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      userID: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    username: string;
    userID: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    userID: string;
    lastActivity?: number;
  }
}

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { 
                    label: "username", 
                    type: "text" 
                },
                password: { 
                    label: "Password", 
                    type: "password",  
                }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const { username, password } = credentials;
                
                try {
                    const userCollectionRef = collection(db, "users");
                    const q = query(userCollectionRef, where("username", "==", username), limit(1));
                    const userSnapshot = await getDocs(q);
          
                    if (userSnapshot.empty) {
                      return null;
                    }
          
                    const userData = userSnapshot.docs[0].data();
          
                    if (userData.password === password) {
                      return {
                        id: userSnapshot.docs[0].id,
                        username: userData.username,
                        userID: userData.userID,
                      };
                    } else {
                      return null;
                    }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            }
        })
    ],

    pages: {
        signIn: '/login',
    },

    session: {
      strategy: 'jwt',
      maxAge: 30 * 60, // 30 minutes
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.userID = user.userID;
                token.lastActivity = Date.now();
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.userID = token.userID;
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET
}