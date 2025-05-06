// import { DateArg, format, formatDistanceToNow } from "date-fns";
import { DateArg, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"
import { z } from "zod";

// export function formatDate(date: DateArg<Date>) {
//     return format(date, 'dd MMM yyyy h:mm a')
// }

// export function timeAgo(date: DateArg<Date>) {
//     return formatDistanceToNow(date) + ' ago'
// }

export const requiredString = () => z
    .string({ required_error: `Trường này không được để trống` })
    .min(1, { message: `Trường này không được để trống` })

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const phoneRegex = /^\d{10}$/

export function timeAgo(date: DateArg<Date>) {
    return formatDistanceToNow(date, { locale: vi }) + ' trước'
}
















export const provinces = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", 
    "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", 
    "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", 
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hải Dương", "Hải Phòng", 
    "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", 
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", 
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", 
    "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", 
    "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", 
    "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", 
    "TP HCM", "Hà Nội", "Cần Thơ", "Đà Nẵng", "Hải Phòng"
];
