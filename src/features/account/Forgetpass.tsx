import { useNavigate } from 'react-router';
import '../../assets/css/otp.css'
import { useAccount } from '../../lib/hook/useAccount';
import { toast } from 'react-toastify';

export default function Forgetpass() {
    const navigate = useNavigate()
    const { updatePassword } = useAccount();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lấy giá trị từ localStorage
        const email = localStorage.getItem('email') || '';
        // Lấy giá trị từ input OTP
        const password = (document.getElementById('input-password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('input-confirmPassword') as HTMLInputElement).value;
        const forgotData: forgotPasswordSchema = {
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        };
        console.log(forgotData);
        updatePassword.mutate(forgotData, {
            onSuccess: () => {
                toast.success('Thay đổi mật khẩu thành công!');
                localStorage.removeItem('email'); // Xóa email khỏi localStorage
                navigate('/login');
            },
            onError: (err) => {
                console.log(err.message);
            }
        });
    };

    return <div id="forget-pass" className="modal d-block shadow-sm">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
            <div className="d-flex justify-content-between align-items-center forget-pass-heading">
                    <i className="fa-solid fa-chevron-left"></i>
                    <h5 className="forget-pass-title fw-bold mx-auto">Mật khẩu mới</h5>
                </div>
                <form onSubmit={handleSubmit} className='input-forget-pass'>
                    <div className="input-custom">
                        <label className="input-label d-block">Nhập mật khẩu mới</label>
                        <div className="position-relative">
                            <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y"></i>
                            <input type="password" id='input-password' placeholder="Nhập mật khẩu mới" className="mt-2 input-control" />
                            <i className="bi bi-eye-slash position-absolute top-50 end-0 translate-middle-y"></i>
                        </div>
                    </div>
                    <div className="input-custom">
                        <label className="input-label d-block">Nhập lại mật khẩu mới</label>
                        <div className="position-relative">
                            <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y"></i>
                            <input type="password" id='input-confirmPassword' placeholder="Nhập lại mật khẩu mới" className="mt-2 input-control" />
                            <i className="bi bi-eye-slash position-absolute top-50 end-0 translate-middle-y"></i>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                    <button type="submit" className="btn-forgot-pass-submit">Xác nhận</button>
                </div>
                </form>
            </div>
        </div>
    </div> 
}