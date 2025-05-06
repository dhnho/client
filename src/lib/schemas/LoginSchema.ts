import { z } from "zod";
import { requiredString } from "../util/util";

export const loginSchema = z.object({
    email: requiredString().email('Email chưa đúng định dạng'),
    password: requiredString()
})

export type LoginSchema = z.infer<typeof loginSchema>