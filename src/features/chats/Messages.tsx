
import { Link } from 'react-router';
import '../../assets/css/messages.css';
import { useMessage } from '../../lib/hook/useMessage';
import { useAccount } from '../../lib/hook/useAccount';
import { timeAgo } from '../../lib/util/util';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { store } from '../../lib/stores/store';

const Messages = observer(() => {

    const { latestMessages } = useMessage()
    const { currentUser } = useAccount()

    const [filteredMessage, setFilteredMessage] = useState<LatestMessage[]>([])
    const [activeBtn, setActiveBtn] = useState('all')

    //Tìm tin nhắn
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if(!latestMessages) return

        const fuse = new Fuse(latestMessages, { 
            keys: ['name'],
            threshold: 0.4
        })

        const keyword = e.target.value;

        if (keyword.trim() === '') {
            setFilteredMessage(latestMessages);
        } else {
            const result = fuse.search(e.target.value)
            const messages = result.map(res => res.item)
            setFilteredMessage(messages);
        }
    }

    //Xử lí và in tin nhắn mới nhất
    const handleLatestMessageContent = (message: LatestMessage) => {
        const content = message.messageType === 'text'? message.content : "[Hình ảnh]"

        let senderName = ''
        if(message.type === 'private') {
            senderName = message.isFromOtherUser === "0" ? "Bạn: " : ""
        } else if(message.type === 'group') {
            senderName = message.senderName + ": "
        }

        return senderName + content
    }

    //Xử lí ảnh đại diện
    const handleAvatarUrl = (avatarUrl: string, type: string) => {
        return avatarUrl ? avatarUrl 
                         : type === 'group' ? '/images/default-group.jpg' : '/images/user.png'
    }

    useEffect(() => {
        if(latestMessages)
            setFilteredMessage(latestMessages);
    }, [latestMessages])

    //Lọc tin nhắn
    useEffect(() => {
        if(!latestMessages) return

        if(activeBtn === 'all') {
            setFilteredMessage(latestMessages)
        } else {
            setFilteredMessage(latestMessages.filter(m => m.type === activeBtn))
        }
    }, [activeBtn, latestMessages])

    //Tạo kết nối
    useEffect(() => {
        if(!currentUser) return

        const setupConnection = async () => {
            store.peerStore.createPeerInstance(currentUser.userId)
            if (!store.messageStore.isConnected) {
                await store.messageStore.createHubConnection();
            }
        };

        setupConnection();

    }, [currentUser]);

    return (
        <div>
            <div className='message-header'>
                <div className='d-flex justify-content-between align-items-center'>
                    <p className='message-text'>Tin nhắn</p>
                </div>

                <div className='position-relative my-3'>
                    <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y"></i>
                    <input onChange={handleSearch} className='w-100 search-input' type="text" placeholder='Nhập tên...' />
                </div>

                <div className="container-fluid g-0">
                    <div className='row group-btn-wrapper m-0'>
                        <button onClick={() => setActiveBtn('all')} className={`col ${activeBtn === 'all' ? "group-btn" : "cancel-btn"}`}>Tất cả</button>
                        <button onClick={() => setActiveBtn('group')} className={`col ${activeBtn === 'group' ? "group-btn" : "cancel-btn"}`}>Nhóm</button>
                        <button onClick={() => setActiveBtn('private')} className={`col ${activeBtn === 'private' ? "group-btn" : "cancel-btn"}`}>Bạn bè</button>
                    </div>
                </div>
            </div>

            <div className='mt-3'>
                {
                    currentUser && filteredMessage?.map((message) => {
                        const avatarUrl = handleAvatarUrl(message.avatarUrl, message.type)
                        return  <Link key={message.conversationId} 
                                      state={{ name: message.name, avatar: avatarUrl, type: message.type }}
                                      to={`/dashboard/message/${message.conversationId}`} 
                                      className={`d-flex message-wrapper text-decoration-none ${store.messageStore.currentConversationId === message.conversationId ? 'active' : ''}`}>
                                    <div className='friend-image-wrapper'>
                                        <img src={avatarUrl} className="img-fluid rounded-circle friend-image" alt="" />
                                    </div>
                
                                    <div className='flex-grow-1 d-flex flex-column align-self-center'>
                                        <div className='d-flex justify-content-between pb-1'>
                                            <p className='m-0 friend-name'>{ message.name }</p>
                                            <p hidden={!message.content} className='m-0 sent-datetime'>{
                                                timeAgo(new Date(message.createdAt))
                                            }</p>
                                        </div>
                
                                        <div className='d-flex justify-content-between'>
                                            <p hidden={!message.content} className='m-0 latest-message'>
                                                { handleLatestMessageContent(message) }
                                            </p>

                                            {/* <span className='quantity'>4</span> */}
                                        </div>
                                    </div>
                                </Link>
                    })
                }
            </div>
        </div>
    );
})

export default Messages