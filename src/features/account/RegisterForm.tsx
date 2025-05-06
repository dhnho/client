import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "../../lib/schemas/RegisterSchema";
import { useAccount } from "../../lib/hook/useAccount";
import { useNavigate } from "react-router";
import '../../assets/css/register.css';
import { Link } from "react-router";
import { useState } from "react";

export default function RegisterForm() {
    const navigate = useNavigate();
    const { checkValidUser } = useAccount();

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched', //tránh thông báo lỗi khi nhập, hiển thị lỗi khi rời input
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterSchema) => {
        await checkValidUser.mutateAsync(data, {
            onSuccess: () => {
                localStorage.setItem('registerForm', JSON.stringify(data));
                navigate('/otp', { replace: true });
            },
            onError: (error) => console.log(error.message)
        });
    };

    return (
        <div className="d-flex justify-content-evenly register-box g-0">
            <div className="d-flex flex-column align-self-center">
                <div className="form-wrapper">
                    <img className="logo-img" src="/images/logo.png" alt="" />
                    <p className="secondary-text">
                        Đăng ký tài khoản để sử dụng ChatZ!
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-custom">
                            <label className="input-label d-block">Email</label>
                            <div className="position-relative">
                                <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y"></i>
                                <input {...register('email')} type="email" placeholder="Nhập email" className="mt-2 input-control" autoComplete="off" />
                            </div>
                            <span className="text-danger fst-italic fs-6">{errors.email?.message}</span>
                        </div>

                        <div className="input-custom">
                            <label className="input-label d-block">Số điện thoại</label>
                            <div className="position-relative">
                                <i className="bi bi-telephone position-absolute top-50 start-0 translate-middle-y"></i>
                                <input {...register('phone')} type="text" placeholder="Nhập số điện thoại" className="mt-2 input-control" autoComplete="off" />
                            </div>
                            <span className="text-danger fst-italic fs-6">{errors.phone?.message}</span>
                        </div>

                        <div className="input-custom">
                            <label className="input-label d-block">Password</label>
                            <div className="position-relative">
                                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y"></i>
                                <input {...register('password')} type={showPassword ? "text" : "password"} placeholder="Nhập password" className="mt-2 input-control input-password" />
                                <div className="position-absolute top-50 end-0 translate-middle-y cursor-pointer">
                                    <i onClick={() => setShowPassword(value => value = !value)}
                                        className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                </div>
                            </div>
                            <span className="text-danger fst-italic fs-6">{errors.password?.message}</span>
                        </div>

                        <div className="input-custom">
                            <label className="input-label d-block">Nhập lại password</label>
                            <div className="position-relative">
                                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y"></i>
                                <input {...register('confirmPassword')} type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại password" className="mt-2 input-control" />
                                <div className="position-absolute top-50 end-0 translate-middle-y cursor-pointer">
                                    <i onClick={() => setShowConfirmPassword(value => value = !value)}
                                        className={showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                </div>
                            </div>
                            <span className="text-danger fst-italic fs-6">{errors.confirmPassword?.message}</span>
                        </div>
                        <button disabled={ !isValid || isSubmitting } type="submit" className="btn-submit">
                            Đăng Ký
                        </button>
                    </form>

                    <p className="text-center mt-4">Bạn có thể <Link to='/login' className="gradient-text fw-bold">Đăng nhập tại đây</Link></p>

                </div>
            </div>
            <div className="custom-img-wrapper">
                <img src="/images/welcome.png" alt="Illustration" className="custom-img" />
            </div>
        </div>
    );
}

