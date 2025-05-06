
import { useEffect, useState } from 'react';
import '../../assets/css/Navbar.css'
import { useAccount } from '../../lib/hook/useAccount';
import { Link, useLocation } from 'react-router';

type Props = {
    onShowFriending: () => void
    onShowProfile: () => void
    isHide: boolean
}

export default function Navbar({ onShowFriending, onShowProfile, isHide }: Props) {
    const { currentUser, logout } = useAccount()

    const location = useLocation()
    const [activePath, setActivePath] = useState('/dashboard')
    // const messageUrl = store.messageStore.currentConversationId ?
    //                             `/dashboard/message/${store.messageStore.currentConversationId}` : '/dashboard'

    useEffect(() => {
        setActivePath(location.pathname)
    }, [location.pathname])
    
    return (
        <div className={`${isHide && activePath.includes('message') ? "d-none d-sm-block" : ""} d-flex flex-column align-items-center position-fixed navbar-container`}>

            <img onClick={onShowProfile} src={ currentUser?.avatar ? currentUser?.avatar : "/images/user.png" } 
                 className="img-fluid rounded-circle cursor-pointer d-none d-sm-block" alt="" />

            <ul className="navbar-nav flex-grow-1 w-100">
                <li className={activePath === '/dashboard' || activePath.includes('message') || window.location.href.includes('message') ? 'nav-item active' : 'nav-item'}>
                    <Link to='/dashboard' className="nav-link"><i className="fa-solid fa-comment-dots"></i></Link>
                </li>

                <li className={activePath.includes('friends') ? 'nav-item active' : 'nav-item'}>
                    <Link to='/dashboard/friends' className="nav-link"><i className="fa-regular fa-address-book"></i></Link>
                </li>

                <li onClick={() => {onShowFriending()}} className="nav-item">
                    <a className="nav-link" href="#"><i className="fa-solid fa-user-plus"></i></a>
                </li>

                <li className="nav-item">
                    <a onClick={() => logout.mutate()} className="nav-link" href="#"><i className="fa-solid fa-circle-left"></i></a>
                </li>

                {/* <div className="nav-item dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown button
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div> */}
                
            </ul>
        </div>
    );
}
