import { useFriend } from "../../lib/hook/useFriend";

export default function Adding() {

    const { senders, acceptFriendRequest, rejectFriendRequest } = useFriend('')

    const accept = async (requestId: number) => {
        await acceptFriendRequest.mutateAsync(requestId)
    }

    const reject = async (requestId: number) => {
        await rejectFriendRequest.mutateAsync(requestId)
    }

    return (
        <div className="my-2">
            <h5 className="friending-heading m-0">Lời mời kết bạn ({senders?.length})</h5>
            
            {
                senders && senders.map((sender) => {
                    return  <div key={sender.requestId} className='px-2 sender-list'>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex align-items-center'>
                                        <img src={sender.avatar ?? "/images/user.png"} className="img-fluid rounded-circle" alt="" />
                                        <div className='ms-3'>
                                            <p className='mb-0'>{sender.fullname}</p>
                                            {/* <p className='mb-0'>Chào bạn nha</p> */}
                                        </div>
                                    </div>
                                    <div className='group-btn-wrapper'>
                                        <button onClick={() => accept(sender.requestId)} className='col group-btn'>Đồng ý</button>
                                        <button onClick={() => reject(sender.requestId)} className='cancel-btn'>Hủy</button>
                                    </div>
                                </div>
                            </div>
                })
            }

            
        </div>
    );
}
