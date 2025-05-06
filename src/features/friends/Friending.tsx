import '../../assets/css/friending.css';
import Adding from './Adding';
import Searching from './Searching';

type Props = {
    onHideFriending: () => void
}

export default function Friending({onHideFriending}: Props) {
    return (
        <div className='friending d-flex justify-content-center align-items-center'>
            <div className='friending-wrapper bg-white shadow-lg m-3'>
                <div className='d-flex justify-content-between friend-header'>
                    <h5 className="friending-heading">Thêm bạn</h5>
                    <i onClick={onHideFriending} className="fa-solid fa-xmark friending-close-btn"></i>
                </div>

                <Searching />

                <Adding />

                {/* <Suggestion /> */}
            </div>
        </div>
    );
}
