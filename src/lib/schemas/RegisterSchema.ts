import { z } from "zod";
import { phoneRegex, requiredString } from "../util/util";

export const registerSchema = z.object({
    email: requiredString().email("Email chưa đúng định dạng"),
    phone: requiredString().regex(phoneRegex, "Số điện thoại phải có 10 chữ số"),
    password: requiredString().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Tối thiểu 8 ký tự, ít nhất 1 ký tự chữ và 1 ký tự số"),
    confirmPassword: requiredString(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ['confirmPassword']
})

export type RegisterSchema = z.infer<typeof registerSchema>;