import { useNavigate } from 'react-router';
import '../../assets/css/otp.css';
import { useAccount } from '../../lib/hook/useAccount';
import { toast } from 'react-toastify';
import CountdownTimer from '../../app/shared/CountDownTimer';
import { useState } from 'react';

export default function OTPForgotPassword() {
    const navigate = useNavigate();
    const { checkOTP } = useAccount();
    const { checkEmail } = useAccount();
    const [timerKey, setTimerKey] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lấy giá trị từ localStorage
        const email = localStorage.getItem('email') || '';
        // Lấy giá trị từ input OTP
        const otpInput = (document.getElementById('input-otp') as HTMLInputElement).value;
        console.log(otpInput);
        const forgotData: forgotPasswordSchema = {
            email: email,
            otp: otpInput,
        };
        checkOTP.mutate(forgotData, {
            onSuccess: () => {
                toast.success('Nhập mật khẩu mới!');
                navigate('/forgot-password');
            },
            onError: (err) => {
                console.log(err.message);
            }
        });
    };

    const handleClick = () => {
        // Lấy giá trị từ localStorage
        const email = localStorage.getItem('email') || '';
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

    return <div id="otp" className="modal d-block shadow-sm">
        <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleSubmit} className="modal-content border-0">
                <div className="d-flex justify-content-between align-items-center otp-heading">
                    <i className="fa-solid fa-chevron-left"></i>
                    <h5 className="otp-title fw-bold mx-auto">Xác nhận email</h5>
                </div>
                <p className='text-center text-otp'>Người dùng vui lòng nhập mã OTP vừa được gửi qua email </p>
                <p className='text-center text-email'>{localStorage.getItem('email') || ''}</p>
                <div className="d-flex justify-content-center">
                    <input type="text" className="input-otp" id="input-otp" />
                </div>
                <div className="d-flex justify-content-between">
                    <CountdownTimer key={timerKey} />
                    <p onClick={handleClick} className="cursor-pointer text-again text-right" id="send-back">Gửi lại OTP</p>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn-otp-submit">Gửi</button>
                </div>
            </form>
        </div>
    </div>;
}
