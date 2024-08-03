import dbConnect from "@/lib/dbConnect"
import AdminModel from "@/models/Admin";
 
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';



export const authOptions = {
 providers: [
    CredentialsProvider({
        id: 'credentials',
        name: 'credentials',
        credentials: {
           phoneNo : {label: 'phoneNo', type: 'number'},
           password : {label: 'Password', type: 'password'}  
        },
        async authorize(credentials){
            await dbConnect();
            try {
                const user = await AdminModel.findOne({
                  $or: [
                 
                    {username: credentials.identifier}
                  ],
                });

                if(!user){
                    throw new Error('No user found with is Phone number and username')
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if(isPasswordCorrect){
                    return user;
                }
                else{
                    throw new Error('Incorrect Password')
                }
            } catch (error) {
                throw new Error(error.message || 'Error during authorization')
            }
        },
    }),
 ],
callback: {
    async jwt({token, user}){
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.username = user.username;
        }
        return token;
    },
    async session({session, token}){
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username; 
    }
    return session;
  },
 },

session: {
    strategy: 'jwt',
},
  secret: process.env.NEXTAUTH_SECRET_KEY,
   pages: {
    signIn: '/sign-in'
   },
};