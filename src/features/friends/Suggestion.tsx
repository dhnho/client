import { useFriend } from "../../lib/hook/useFriend";

export default function Suggestion() {
    const { suggestedUsers } = useFriend()

    return (
        <div id="suggestion" className="pt-3">
            <h5 className="friending-heading m-0">Gợi ý kết bạn</h5>

            <div className="container-fluid">
                <div className="row">
                    {
                        suggestedUsers && suggestedUsers.map(user => {
                            return <div className="col-6 d-flex mt-3">
                            <img src={user.avatar ?? "/images/user.png"} className="img-fluid" alt="" />
                            <div className="ms-2">
                                <p className="mb-1">{ user.fullname }</p>
                                <div className='group-btn-wrapper m-0'>
                                    <button className='col group-btn'>Đồng ý</button>
                                    <button className='cancel-btn'>Hủy</button>
                                </div>
                            </div>
                        </div>
                        })
                    }
                    
                </div>
            </div>
        </div>
    );
}
