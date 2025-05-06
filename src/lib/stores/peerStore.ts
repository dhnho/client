import { makeAutoObservable, runInAction } from "mobx";
import Peer from 'peerjs';
import { toast } from "react-toastify";

export class PeerStore {
    peerId = '';
    currentUserMedia = null as MediaStream | null;

    remotePeerId = '';
    remoteUserMedia = null as MediaStream | null;
    remoteUser = null as User | null;

    remoteUserAvatar = null as string | null
    showRemoteCamera = false

    peerInstance = null as Peer | null;

    //pending, reply, calling
    callStatus = ''

    constructor() {
        makeAutoObservable(this);
    }

    async createPeerInstance(userId: number) {
        if(this.peerInstance) return
        
        runInAction(async () => {
            try {
                this.currentUserMedia = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
                this.currentUserMedia.getVideoTracks().forEach(track => track.enabled = false);
            } catch {
                toast.warning("Vui lòng mở quyền truy cập camera và micro trong cài đặt trình duyệt.")
            }
        })

        const peer = new Peer('chatz' + userId, {
            host: "peerserver-to1e.onrender.com",
            secure: true,
            port: 443,
            path: '/'
        });
        peer.on('open', (id) => {
            runInAction(() => {
                this.peerId = id;
            });
        });

        peer.on('connection', conn => {
            conn.on('data', (data) => {
                runInAction(() => {
                    const message = data as ToggleCamera
                    this.showRemoteCamera = message.showRemoteCamera
                })
            });
        });

        peer.on("call", (call) => {
            if(!this.currentUserMedia) return
            
            call.answer(this.currentUserMedia);
            call.on("stream", (remoteStream) => {
                runInAction(() => {
                    this.remoteUserMedia = remoteStream
                })
            });
        });

        this.peerInstance = peer;
    }

    makeCall() {
        if(!this.peerInstance || !this.currentUserMedia) return
        
        console.log(this.currentUserMedia)
        const call = this.peerInstance.call(this.remotePeerId, this.currentUserMedia);
		call.on("stream", (remoteStream) => {
			runInAction(() => {
                this.remoteUserMedia = remoteStream
            })
		});
    }

    endCall() {
        this.remoteUserMedia?.getTracks().forEach(track => track.stop());
        this.remoteUserMedia = null;

        this.remotePeerId = ''
        this.remoteUser = null
        this.remoteUserAvatar = ''
        this.showRemoteCamera = false

        this.callStatus = ''
    }

    toggleCamera(showRemoteCamera: boolean) {
        if(!this.peerInstance || this.remotePeerId === '') return

        const conn = this.peerInstance.connect(this.remotePeerId)
        conn.on('open', () => {
            conn.send({ type: 'toggle-camera', showRemoteCamera })
        })
    }
}