import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { prismaClient } from "@/app/lib/db";
import { Provider } from "@prisma/client";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = ({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    pages:{
        signIn: '/auth/signin'
    },
    callbacks: {
        async signIn({ user }){
            if(!user.email){
                return false
            }
            try{
                const existingUser = await prismaClient.user.findUnique({
                    where: {
                        email: user.email
                    }
                })
                if (existingUser){
                    return true
                }
                await prismaClient.user.create({
                    data: {
                        email: user.email,
                        name: user.name ?? "",
                        userImage: user.image ?? "",
                        provider: Provider.Google
                    }
                })
                return true
            }catch(e){
                console.log(e)
                return false
            }
        },
        
        async session({ session }){
            if(session.user){
                const existingUser = await prismaClient.user.findFirst({
                    where: {
                        email: session.user.email || ""
                    }
                })
                session.user.id = existingUser?.id || ""
            }
            return session
        }
    }
})


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }