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

    async createPeerInstance(userId: number): Promise<string | undefined> {
        if (this.peerInstance) return this.peerId;
    
        try {
            this.currentUserMedia = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            // this.currentUserMedia.getVideoTracks().forEach(track => track.enabled = false);
        } catch {
            toast.warning("Vui lòng mở quyền truy cập camera và micro trong cài đặt trình duyệt.");
            return undefined;
        }
    
        return new Promise((resolve, reject) => {
            const peer = new Peer('chatz' + userId, {
                host: "peerserver-to1e.onrender.com",
                secure: true,
                port: 443,
                path: '/'
            });
    
            peer.on('open', (id) => {
                runInAction(() => {
                    this.peerInstance = peer;
                    this.peerId = id;
                });
                resolve(id);
            });
    
            peer.on('error', (err) => {
                console.error("PeerJS error:", err);
                reject(err);
            });
    
            peer.on('connection', conn => {
                conn.on('data', (data) => {
                    runInAction(() => {
                        const message = data as ToggleCamera;
                        this.showRemoteCamera = message.showRemoteCamera;
                    });
                });
            });
    
            peer.on('call', (call) => {
                if (!this.currentUserMedia) return;
    
                call.answer(this.currentUserMedia);
                call.on('stream', (remoteStream) => {
                    runInAction(() => {
                        this.remoteUserMedia = remoteStream;
                    });
                });
            });
        });
    }
    

    makeCall() {
        if(!this.peerInstance || !this.currentUserMedia) return

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