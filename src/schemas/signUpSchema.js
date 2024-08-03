import {z} from "zod"
//need to correct name of file
export const usernameValidation = z
.string()
.min(2, "username at least 2 characters")
.max(20, "username must be no more than 20")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain spacial character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be at least 6 characters"})  
})