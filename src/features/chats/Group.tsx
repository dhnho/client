import { ChangeEvent, useEffect, useState } from 'react';
import '../../assets/css/group.css';
import { useFriend } from '../../lib/hook/useFriend';
import { useConversation } from '../../lib/hook/useConversation';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router';

type Props = {
    setShowCreatGroup: () => void
}

export default function Group({ setShowCreatGroup }: Props) {
    const location = useLocation()
    const { id } = useParams();
    const { friends } = useFriend();
    const { createConversation, groupInfo, addMember } = useConversation(undefined, Number(id))

    const [groupName, setGroupName] = useState<string>('')
    const [selectedUser, setSelectedUser] = useState<User[]>([])

    const [isCreatedMode, setIsCreatedMode] = useState<boolean>()
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])

    const [initialUsers, setInitialUsers] = useState<User[]>([])

    const selectUser = (user: User) => {
        if (selectedUser.some(u => u.userId === user.userId))
            setSelectedUser(selectedUser.filter(u => u.userId !== user.userId));
        else
            setSelectedUser([...selectedUser, user]);
    }

    const createGroup = async () => {
        await createConversation.mutateAsync({
            name: groupName,
            memberUserIds: selectedUser.map(u => u.userId)
        }, {
            onSuccess: () => {
                setGroupName('')
                setSelectedUser([])
                toast.success("Tạo nhóm thành công")
            }
        })
    }

    const addMembers = async () => {
        await addMember.mutateAsync({
            conversationId: Number(id),
            memberUserIds: selectedUser.map(u => u.userId),
            name: ""
        }, {
            onSuccess: () => {
                setSelectedUser([])
                toast.success("Thêm thành công")
            }
        })
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if(!friends) return

        const keyword = e.target.value;

        if (keyword.trim() === '') {
            setFilteredUsers(initialUsers);
        } else {
            const result = initialUsers.filter((user) =>
                user.fullname.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredUsers(result);
        }
    }

    useEffect(() => {
        if(!friends) return

        if(location.pathname.includes('/friends')) {
            setIsCreatedMode(true)
            setInitialUsers(friends)
        } else {
            if(!groupInfo) return

            setIsCreatedMode(false)
            const newMembers = friends.filter((user) => {
                return !groupInfo.listMember.some(m => m.userId === user.userId)
            })

            if(newMembers)
                setInitialUsers(newMembers)
        }

    }, [location, groupInfo, friends, selectedUser, isCreatedMode])

    useEffect(() => {
        setFilteredUsers(initialUsers)
    }, [initialUsers])

    return <div id="group" className="modal d-block shadow-sm" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0">

                <div className="d-flex justify-content-between group-heading">
                    <h5 className="group-title fw-bold">{ isCreatedMode ? "Tạo nhóm" : "Thêm thành viên" }</h5>
                    <i onClick={setShowCreatGroup} className="fa-solid fa-xmark cursor-pointer"></i>
                </div>

                <div className="">
                    <div className={`${isCreatedMode ? "d-flex" : "d-none"} group-name-wrapping align-items-center mt-4`}>
                        <div className='position-relative m-0'>
                            <img src="/images/default-group.jpg" className="img-fluid rounded-circle" alt="" />
                        </div>
                        <input value={groupName} onChange={(e) => setGroupName(e.target.value) } type="text" className="group-name" placeholder="Nhập tên nhóm ..." />
                    </div>

                    <div className='position-relative m-0 mt-4'>
                        <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y"></i>
                        <input onChange={handleSearch} className='w-100 search-input' type="text" placeholder='Nhập tên...' />
                    </div>

                    <div className="row my-4">
                        <div className="col-7">
                            <div className="mb-2 hidden-text">Đã chọn</div>
                            <div>
                                {
                                    filteredUsers && filteredUsers.map((friend) => {
                                        const isSelected = selectedUser.some(u => u.userId === friend.userId);
                                        return <div key={friend.userId} className="user-item">
                                            <input checked={isSelected} onChange={() => selectUser(friend)} type="checkbox" className="btn-check" id={"btncheck" + friend.userId} autoComplete="off" />
                                            <label className="btn-check-label cursor-pointer" htmlFor={"btncheck" + friend.userId}><i className="bi bi-check"></i></label>

                                            <img src={friend.avatar ? friend.avatar : "/images/user.png"} className="user-avatar" />
                                            <span>{friend.fullname}</span>
                                        </div>;
                                    })
                                }
                            </div>
                        </div>

                        <div className="col-5 selected-list">
                            <div className="mb-2 fw-semibold">Đã chọn ({selectedUser.length})</div>
                            {
                                selectedUser.map(user => {
                                    return <div key={user.userId} className="user-item">
                                        <img src={user.avatar ? user.avatar : "/images/user.png"} className="user-avatar" />
                                        <span>{user.fullname}</span>
                                    </div>;
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-end'>
                    <div className='group-btn-wrapper' style={{ margin: 0 }}>
                        <button onClick={setShowCreatGroup} className='cancel-btn'>Hủy</button>
                        <button hidden={!isCreatedMode} onClick={createGroup} disabled={selectedUser.length < 1 || groupName === ''} className='group-btn'>Tạo nhóm</button>
                        <button hidden={isCreatedMode} onClick={addMembers} disabled={selectedUser.length < 1} className='group-btn'>Thêm</button>
                    </div>
                </div>

            </div>
        </div>
    </div>;
}