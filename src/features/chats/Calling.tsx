import { useEffect, useRef, useState } from "react";
import "../../assets/css/Calling.css";
import { store } from "../../lib/stores/store";
import { observer } from "mobx-react-lite";

const Calling = observer(() => {
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement>(null);

    const [showCamera, setShowCamera] = useState(false)

    const acceptCall = () => {
        store.messageStore.acceptCall(store.peerStore.remoteUser!.userId)
    }

    const endCall = () => {
        if (currentUserVideoRef.current) currentUserVideoRef.current.srcObject = null;

        // if(store.peerStore.callStatus === 'pending') {
        //     store.peerStore.endCall()
        //     return
        // }

        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        if(store.peerStore.remoteUser) store.messageStore.endCall(store.peerStore.remoteUser.userId)

        store.peerStore.endCall()
    }

    const toggleCamera = () => {
        setShowCamera(v => !v)
    }

    useEffect(() => {
        if(!store.peerStore.currentUserMedia) return

        store.peerStore.toggleCamera(showCamera)
        // store.peerStore.currentUserMedia.getVideoTracks().forEach(track => track.enabled = true);

    }, [showCamera])

    useEffect(() => {
        if (!currentUserVideoRef.current) return;
        
        currentUserVideoRef.current.srcObject = store.peerStore.currentUserMedia;
    }, [store.peerStore.currentUserMedia]);

    useEffect(() => {
        if (!remoteVideoRef.current) return;

        remoteVideoRef.current.srcObject = store.peerStore.remoteUserMedia;
    }, [store.peerStore.remoteUserMedia]);

    //Bắt sự kiện reload hoặc thoát trình duyệt
    useEffect(() => {
        console.log(store.peerStore.callStatus)
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div className="h-100 position-relative bg-black">
            <video hidden={!showCamera} className="video-ref position-absolute top-0 end-0 mt-3 me-3 rounded-2 z-2" muted autoPlay ref={currentUserVideoRef}></video>
            <img hidden={store.peerStore.showRemoteCamera} className="background-calling h-100 w-100" style={{background: `url("${store.peerStore.remoteUser?.avatar ?? '/images/user.png'}") no-repeat center / cover`}} />
            <video className="video-ref h-100 w-100 object-fit-cover" autoPlay ref={remoteVideoRef}></video>
            <div className="position-absolute top-50 start-50 translate-middle h-100 d-flex flex-column">
                { !store.peerStore.showRemoteCamera && <div className="d-flex flex-column align-content-center justify-content-center flex-wrap flex-grow-1">
                    <div className="ratio ratio-1x1 avatar-calling">
                        <img className="object-fit-cover rounded-circle border-2 border-white border" src={store.peerStore.remoteUser?.avatar ?? '/images/user.png'} alt="" />
                    </div>
                    {/* <p className="time-calling text-center mb-0 mt-2">4:30</p> */}
                </div> }

                <div className="d-flex justify-content-between align-self-center mb-5 mt-auto">
                    { store.peerStore.callStatus === 'reply' && 
                        <button onClick={acceptCall} className="btn-calling-control accept-calling">
                            <i className="fa-solid fa-phone"></i>
                    </button> }

                    { store.peerStore.callStatus === 'calling' && 
                        <button onClick={toggleCamera} className="btn-calling-control">
                            <i hidden={showCamera} className="fa-solid fa-video"></i>
                            <i hidden={!showCamera} className="fa-solid fa-video-slash"></i>
                    </button> }

                    <button onClick={endCall} className="btn-calling-control cancel-calling">
                        <i className="fa-solid fa-phone"></i>
                    </button>

                    { store.peerStore.callStatus === 'calling' && 
                        <button disabled className="btn-calling-control">
                            <i className="fa-solid fa-microphone"></i>
                    </button> }
                </div>
            </div>
        </div>
    ); 
});

export default Calling;