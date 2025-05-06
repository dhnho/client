import { Link, useNavigate } from 'react-router';
import '../../assets/css/ListFriends.css'
import { useConversation } from '../../lib/hook/useConversation';
import { useFriend } from '../../lib/hook/useFriend';
import { ChangeEvent, useEffect, useState } from 'react';
import Group from '../chats/Group';

type FriendOrGroup = User | GroupInfo

export default function ListFriend() {
    const [user, setUser] = useState<User | null>(null)
    const [activeBtn, setActiveBtn] = useState("friend");
    const [showCreatGroup, setShowCreatGroup] = useState(false)
    
    const [filteredList, setFilteredList] = useState<FriendOrGroup[]>([])

    const navigate = useNavigate()
    const { friends } = useFriend()
    const { conversationId, groups } = useConversation(user?.userId)

    const navigateToMessage = (user: User) => {
        setUser(user)
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if(!friends || !groups) return

        const keyword = e.target.value;

        if (keyword.trim() === '') {
            setFilteredList(activeBtn === 'group' ? groups : friends);
        } else {
            if(activeBtn === 'friend') {
                const result = friends.filter((user) =>
                    user.fullname.toLowerCase().includes(keyword.toLowerCase())
                );
    
                setFilteredList(result);

            } else if(activeBtn === 'group') {
                const result = groups.filter((group) =>
                    group.name.toLowerCase().includes(keyword.toLowerCase())
                );
    
                setFilteredList(result);
            }
            
        }
    }

    //Điều hướng
    useEffect(() => {
        if(user && user.userId != 0 && conversationId) {
            navigate(`/dashboard/message/${conversationId}`, { replace: true, state: {
                name: user.fullname,
                avatar: user.avatar
            }})
        }
    }, [user, conversationId, navigate])

    useEffect(() => {
        if(!friends || !groups) return

        if(activeBtn === 'friend')
            setFilteredList(friends);
        else if(activeBtn === 'group')
            setFilteredList(groups)

    }, [activeBtn, friends, groups]);

    return (
        <div id="list-friend">
            <h5 className="list-friend-heading">Danh bạ</h5>
            <div className='d-flex justify-content-between'>
                <div className='row group-btn-wrapper m-0'>
                    <button className={activeBtn === "friend" ? "group-btn col" : "cancel-btn col"}
                            onClick={() => setActiveBtn("friend")}>Bạn bè</button>
                    <button className={activeBtn === "group" ? "group-btn col" : "cancel-btn col"}
                            onClick={() => setActiveBtn("group")}>Nhóm</button>
                </div>

                <button onClick={() => setShowCreatGroup(true)} hidden={activeBtn !== 'group'} className='group-btn'>Tạo nhóm</button>
            </div>

            <div className='position-relative'>
                    <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y"></i>
                    <input onChange={handleSearch} autoComplete="off"
                        className='w-100 search-input' type="text" placeholder="Nhập tên bạn bè" />
            </div>
            <div className='friend-list-item'>
                {
                    activeBtn === 'friend' && filteredList && (filteredList as User[]).map((friend) => {
                        return <div onClick={() => navigateToMessage(friend)} key={friend.userId} className='d-flex justify-content-between align-items-center pb-3 cursor-pointer'>
                            <div className='d-flex align-items-center'>
                                <img src={ friend?.avatar ? friend?.avatar : "/images/user.png" } className="img-fluid rounded-circle" alt="" />
                                <p className='mb-0 ms-3 text-black'>{ friend.fullname }</p>
                            </div>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                    })
                }

                {
                    activeBtn === 'group' && filteredList && (filteredList as GroupInfo[]).map((group) => {
                        return <Link to={`/dashboard/message/${group.conversationId}`} key={group.conversationId} className='d-flex justify-content-between align-items-center pb-3 cursor-pointer text-decoration-none'>
                            <div className='d-flex align-items-center'>
                                <img src={group.url ?? "/images/default-group.jpg"} className="img-fluid rounded-circle" alt="" />
                                <p className='mb-0 ms-3 text-black'>{group.name}</p>
                            </div>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </Link>;
                    })
                }
            </div>
            
            { showCreatGroup && 
                <Group setShowCreatGroup={() => { setShowCreatGroup(false)}} /> 
            }
        </div>
    );
}
