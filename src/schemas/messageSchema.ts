import { z } from 'zod'

export const messageSchema = z.object({
    content: z.string().min(5,{message : "content should be atleast of 5 char"})
    .max(300 , {message : "Content should not be more than 300 characters"})
})