import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2 , "Username must be 2 character long")
    .max(20 , "Username must not be more than 20 characters")
    .regex(/^[a-zA-Z0-9]*$/ , "Username should not contain special characters"
    )

export const signupSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(6,{message : "Password should be minimum of 6 characters"})
})
