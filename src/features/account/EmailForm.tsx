import { useNavigate } from 'react-router';
import '../../assets/css/otp.css'
import { useAccount } from '../../lib/hook/useAccount';
import { toast } from 'react-toastify';

export default function EmailForm() {
    const navigate = useNavigate()
    const { checkEmail } = useAccount();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lấy giá trị từ input email
        const email = (document.getElementById('email-input') as HTMLInputElement).value;
        checkEmail.mutate( email , {
            onSuccess: () => {
                localStorage.setItem("email", email);
                toast.success('OTP đã được gửi đến email của bạn!');
                navigate('/otp-forgot-password');
            },
            onError: (err) => {
                console.log(err.message);
            }
        });
    };


    return <div id="email" className="modal d-block shadow-sm">
        <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleSubmit} className="modal-content border-0">
                <div className="d-flex justify-content-between align-items-center email-heading">
                    <i className="fa-solid fa-chevron-left"></i>
                    <h5 className="email-title fw-bold mx-auto">Nhập Email</h5>
                </div>
                <p className=' text-center'>Vui lòng nhập email để đổi mật khẩu</p>
                <div className="input-custom">
                    <label className="input-label d-block">Email</label>
                    <div className="position-relative">
                    <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y"></i>
                    <input type="email" placeholder="Nhập email" className="mt-2 input-control" id='email-input'/>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn-email-submit">Gửi</button>
                </div>
            </form>
        </div>
    </div> 
}