import { string, z } from "zod";
import { phoneRegex, requiredString } from "../util/util";

export const profileSchema = z.object({
    fullname: requiredString(),
    email: requiredString().email(),
    phone: requiredString().regex(phoneRegex),
    address: requiredString(),
    gender: requiredString(),
    dateOfBirth: string().nullable()
})

export type ProfileSchema = z.infer<typeof profileSchema>