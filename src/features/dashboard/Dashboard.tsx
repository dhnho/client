import { Outlet, useLocation } from "react-router";
import Navbar from "../../app/layout/Navbar";
import Messages from "../chats/Messages";
import Friending from "../friends/Friending";
import { useEffect, useRef, useState } from "react";
import Profile from "../account/Profile";
import { useAccount } from "../../lib/hook/useAccount";
import { toast } from "react-toastify";
import { store } from "../../lib/stores/store";
import { observer } from "mobx-react-lite";
import "../../assets/css/dashboard.css"
import Calling from "../chats/Calling";

const Dashboard = observer(() => {
    const [showFriending, setShowFriending] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const { currentUser } = useAccount()

    const location = useLocation()
    
    //Yêu cầu nhập thông tin nếu lần đầu sử dụng
    useEffect(() => {
        if(!currentUser) {
            store.uiStore.isBusy()
            return
        }

        if(currentUser)
            store.uiStore.isIdle()

        if(!currentUser.fullname) {
            setShowProfile(true)
            toast.warning("Vui lòng nhập đầy đủ thông tin")
        }

    }, [currentUser])

    //Xử lí ẩn hiện trên nhiều màn hình
    const divRef = useRef(null);
    const [isThreadVisible, setIsThreadVisible] = useState(false);
    
    useEffect(() => {
        const checkVisibility = () => {
            if (divRef.current) {
                const style = window.getComputedStyle(divRef.current);
                setIsThreadVisible(style.display !== 'none');
            }
        };

        checkVisibility();
        window.addEventListener('resize', checkVisibility);

        return () => window.removeEventListener('resize', checkVisibility);
        
    }, [isThreadVisible]);

    //active nav trong navbar
    useEffect(() => {
        if(location.pathname.includes("/message") || location.pathname.includes("/friends")) {
            setIsThreadVisible(true)
        } else {
            setIsThreadVisible(false)
        }

    }, [location.pathname])

    return (
        <div>
            <Navbar isHide={isThreadVisible}
                    onShowFriending={() => setShowFriending(true)} 
                    onShowProfile={() => setShowProfile(true)} />

            <div className="container-fluid g-0 app-container">
                <div className="row g-0" style={{height: '100vh'}}>
                    <div className={`${isThreadVisible ? "col-md-4 d-md-block col-xl-3 d-xl-block d-none" : "col-12 col-md-4 col-lg-4 col-xl-3"} border-end`}>
                        <Messages />
                    </div>
                    <div ref={divRef} className={`${isThreadVisible ? "col-md-8 col-xl-9 col-xs-12 col-12" : "d-none"} flex-grow-1`}>
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* { !store.peerStore.isCalling && store.peerStore.remoteUser &&
                <div id="call-request" className="position-fixed top-0 bottom-0 start-0 end-0 d-flex flex-column justify-content-center align-items-center">
                    <img src={store.peerStore.remoteUser.avatar ?? "/images/user.png"} className="img-fluid rounded-circle" alt="" />
                    <h5 className="mt-2 mb-0 text-white">{ store.peerStore.remoteUser.fullname }</h5>
                    <div className="mt-3">
                        <button className="btn btn-success me-2" onClick={() => {
                            store.messageStore.acceptCall(store.peerStore.remoteUser!.userId)
                        }}>Trả lời</button>
                        <button className="btn btn-danger">Hủy</button>
                    </div>
                </div> 
            } */}
            
            { store.peerStore.callStatus !== '' && 
                <div className="position-fixed top-0 bottom-0 end-0 start-0 z-1">
                    <Calling />
                </div> 
            }

            { showFriending && <Friending onHideFriending={() => setShowFriending(false)} /> }

            { showProfile && <Profile onShowProfile={() => setShowProfile(false)} /> }
                
            
        </div>
    );
})

export default Dashboard