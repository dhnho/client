import { useAccount } from "../../lib/hook/useAccount";

type Props = {
    message: Message
    prevSenderId: number
    type: string
}

export default function Message({ message, prevSenderId, type }: Props) {
    const { currentUser, loadingCurrentUser } = useAccount();

    if(loadingCurrentUser || !currentUser) return

    const isMyMessage = currentUser.userId === message.senderId
    const isPrevSender = message.senderId === prevSenderId
    const [hours, minutes] = message.createdAt.toString().split('T')[1].split(':');
    const formatted = `${hours}:${minutes}`;

    return (
        <div className={`message-wrap d-flex ${isMyMessage ? 'justify-content-end' : 'align-items-start'}`}>
            <div hidden={isMyMessage} className="me-2">
                <img hidden={type === 'private'} src={ message.avatar ?? "/images/user.png" } className={`img-fluid friend-image rounded-circle ${isPrevSender ? 'invisible' : ''}`} alt="" />
            </div>
            <div className={`d-flex flex-column ${isMyMessage ? 'align-items-end' : 'align-items-start'}`}>
                <div className={`message ${isMyMessage ? 'my-message' : 'your-message'} ${!isMyMessage && message.messageType === "image" ? "bg-transparent" : ""}`}>
                    {
                        message.messageType !== 'image' 
                            ? <div className="m-0 p-2">
                                <p hidden={isMyMessage || isPrevSender} className='mb-0 message-sender-name fw-bold'>{ type === 'group' && message.senderName }</p>
                                { message.content }
                            </div> 
                            : <div>
                                <span hidden={isMyMessage || isPrevSender} className='mb-0 message-sender-name badge mb-1' style={{backgroundColor: "#E5EAFF"}}>{ type === 'group' && message.senderName }</span> <br />
                                <img src={message.content} className="rounded-2" style={{maxWidth: '100%'}} alt="" />
                            </div>
                    }
                </div>
                
                <div className='message-time'>{ formatted }</div>
            </div>
        </div>
    );
}
