import {z} from 'zod'

export const userPromptSchema = z.string().min(10, 'minimum prompt length should be 10 character')