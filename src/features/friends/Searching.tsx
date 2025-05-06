import { useEffect, useState } from "react";
import { emailRegex, phoneRegex } from "../../lib/util/util";
import { useFriend } from "../../lib/hook/useFriend";
import { useAccount } from "../../lib/hook/useAccount";

export default function Searching() {
    const [querySearch, setQuerySerch] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const { userSearchResult, sendFriendRequest } = useFriend(querySearch)
    const { currentUser } = useAccount()

    useEffect(() => {
        const timer = setTimeout(() => {
            if(emailRegex.test(searchInput) || phoneRegex.test(searchInput))
                setQuerySerch(searchInput)
            else
                setQuerySerch('')
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput]);

    const sendRequest = async () => {
        if(userSearchResult) {
            await sendFriendRequest.mutateAsync(userSearchResult.userId)
        }
    }

    return (
        <div className='search-wrapper'>
            <form>
                <div className='position-relative'>
                    <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y"></i>
                    <input onChange={(e) => setSearchInput(e.target.value)} autoComplete="off"
                        className='w-100 search-input' type="text" placeholder="Nhập SĐT hoặc Email" />
                </div>
            </form>

            {
                userSearchResult && userSearchResult.status && <div className='search-result text-decoration-none'>
                    <div className='d-flex justify-content-between p-2'>
                        <div className='d-flex align-items-center'>
                            <img src={ userSearchResult.avatar ?? "/images/user.png" } className="img-fluid rounded-circle" alt="" />
                            <p className='mb-0 ms-3 text-black'>{ userSearchResult.fullname ? userSearchResult.fullname : "[Chưa có tên]" }</p>
                        </div>

                        <div className='d-flex align-items-center'>
                            <button hidden={currentUser?.phone === querySearch || currentUser?.email === querySearch} 
                                    disabled={userSearchResult.status != 'stranger'} className='col group-btn' onClick={sendRequest}
                            >
                                { userSearchResult.text }
                            </button>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    );
}
