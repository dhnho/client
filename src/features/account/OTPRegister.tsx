import { useNavigate } from 'react-router';
import '../../assets/css/otp.css'
import { useAccount } from '../../lib/hook/useAccount';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import CountdownTimer from '../../app/shared/CountDownTimer';

export default function OTPRegister() {
    const navigate = useNavigate()
    const { registerUser, checkEmail } = useAccount();

    const [email, setEmail] = useState<string>('');
    const [timerKey, setTimerKey] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const otpInput = (document.getElementById('input-otp') as HTMLInputElement).value;
        
        const savedForm = JSON.parse(localStorage.getItem('registerForm') || '{}');
        registerUser.mutate({ ...savedForm, otp: otpInput }, {
            onSuccess: () => {
                localStorage.removeItem('registerForm');
                toast.success('Đăng ký thành công!');
                navigate('/login');
            },
            onError: (err) => {
                console.log(err.message);
            }
        });
    };

    const handleClick = () => {
        checkEmail.mutate(email, {
            onSuccess: () => {
                toast.success('OTP đã được gửi đến email của bạn!');
                setTimerKey((prev: number) => prev + 1); // reset lại đếm ngược
            },
            onError: (err) => {
                console.log(err.message);
            }
        });
    };

    useEffect(() => {
        const savedForm = JSON.parse(localStorage.getItem('registerForm') || '{}');
        setEmail(savedForm.email)
    }, [])

    // useEffect(() => {
    //     if(email === '') navigate('/register')
            
    // }, [email, navigate])


    return <div id="otp" className="modal d-block shadow-sm">
    <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={handleSubmit} className="modal-content border-0">
            <div className="d-flex justify-content-between align-items-center otp-heading">
                <i className="fa-solid fa-chevron-left"></i>
                <h5 className="otp-title fw-bold mx-auto">Xác nhận đăng ký</h5>
            </div>
                <p className='text-center text-otp'>Người dùng vui lòng nhập mã OTP vừa được gửi qua gmail </p>
                <p className='text-center text-email'>{ email }</p>
                <div className="d-flex justify-content-center">
                    <input autoComplete='off' type="text" className="input-otp p-3" id="input-otp" />
                </div>
                <div className="d-flex justify-content-between">
                    <CountdownTimer key={timerKey}/>
                    <p onClick={handleClick} className="text-again text-right cursor-pointer">Gửi lại OTP</p>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn-otp-submit">Gửi</button>
                </div>
            </form>
        </div>
    </div> 
}