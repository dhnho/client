import { useNavigate } from 'react-router';
import '../../assets/css/otp.css'
import { useAccount } from '../../lib/hook/useAccount';
import { toast } from 'react-toastify';

export default function OTPRegister() {
    const navigate = useNavigate()
    const { registerUser } = useAccount();
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


    return <div id="otp" className="modal d-block shadow-sm">
    <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={handleSubmit} className="modal-content border-0">
            <div className="d-flex justify-content-between align-items-center otp-heading">
                <i className="fa-solid fa-chevron-left"></i>
                <h5 className="otp-title fw-bold mx-auto">Xác nhận đăng ký</h5>
            </div>
                <p className='text-center text-otp'>Người dùng vui lòng nhập mã OTP vừa được gửi qua gmail </p>
                <p className='text-center text-email'>Sophia@gmail.com</p>
                <div className="d-flex justify-content-center">
                    <input type="text" className="input-otp p-3" id="input-otp" />
                </div>
                <div className="d-flex justify-content-between">
                    <p className="text-left">0:58</p>
                    <p className="text-again text-right">Gửi lại OTP</p>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn-otp-submit">Gửi</button>
                </div>
            </form>
        </div>
    </div> 
}