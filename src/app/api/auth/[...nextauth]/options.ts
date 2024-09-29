import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, limit, getDocs } from "firebase/firestore"; // Import Firestore methods
import db from "@/app/utilities/firebase/firestore";
import { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                role: { 
                    label: "Role", 
                    type: "text" 
                },
                password: { 
                    label: "Password", 
                    type: "password",  
                }
            },
            async authorize(credentials) {
                // Check if credentials is defined
                if (!credentials) {
                    return null;
                }

                const { role, password } = credentials;
                
                try {
                    // Query Firestore to find the user by role
                    const userCollectionRef = collection(db, "users");  // Use collection() to reference "users" collection
                    const q = query(userCollectionRef, where("role", "==", role), limit(1));  // Query to match the role
                    const userSnapshot = await getDocs(q);  // Execute the query and get the matching documents
          
                    if (userSnapshot.empty) {
                      // No matching user found
                      return null;
                    }
          
                    const userData = userSnapshot.docs[0].data();  // Get the first matched user data
          
                    // Compare password from Firestore with the provided one
                    if (userData.password === password) {
                      // If the password matches, return the user object
                      return {
                        id: userSnapshot.docs[0].id,
                        role: userData.role,
                        userID: userData.userID,  // Assuming you store userID in Firestore
                      };
                    } else {
                      // If the password doesn't match, return null
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
        signIn: '/login',  // Redirect to login page
    }
} 