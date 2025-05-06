import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../../lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useAccount } from "../../lib/hook/useAccount";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function LoginForm() {
    const navigate = useNavigate()
    const { loginUser, currentUser } = useAccount();
    const [showPassword, setShowPassword] = useState(false)

    const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched', //tránh thông báo lỗi khi nhập, hiển thị lỗi khi rời input
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => { 
                toast.success("Đăng nhập thành công")
                navigate('/dashboard')
            },
            onError: (error) => console.log(error.message)
        })
    }

    useEffect(() => {
        if(currentUser) navigate('/dashboard')
    }, [currentUser, navigate])

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

                    <div className="text-end mb-4">
                        <Link to={'/email'} className="gradient-text fw-bold">Quên mật khẩu</Link>
                    </div>

                    <button disabled={!isValid || isSubmitting} type="submit" className="btn-submit">
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center mt-4">Bạn có thể <Link to='/register' className="gradient-text fw-bold">Đăng ký tại đây</Link></p>
            </div>
        </div>
        <div className="custom-img-wrapper">
            <img src="/images/welcome.png" alt="Illustration" className="custom-img" />
        </div>
    </div>
    );
}
