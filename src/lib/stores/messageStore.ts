import { makeAutoObservable, runInAction } from "mobx";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { store } from "./store";

export class MessageStore {
    messageGroup = {} as { [key: string]: Message[]; };
    hubConnection = null as HubConnection | null;
    isConnected = false;
    currentConversationId = null as number | null;
    latestMessage: Message | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async createHubConnection() {
        if (this.hubConnection) return;

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_MESSAGE_URL}`, {
                withCredentials: false,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('ReceiveMessage', async (message: Message) => {
            await runInAction(async () => {
                if (message.conversationId == this.currentConversationId) {
                    const today = 'Hôm nay';
                    if (!this.messageGroup[today])
                        this.messageGroup[today] = [];

                    this.messageGroup[today].push(message);
                }

                this.latestMessage = message
            });
        });

        this.hubConnection.on('ReceiveCallRequest', async (request: CallRequest) => {
            await runInAction(async () => {
                console.log(request)
                console.log("currentPeerId: " + store.peerStore.peerId)
                store.peerStore.remotePeerId = request.peerId
                store.peerStore.remoteUser = request.user
                store.peerStore.callStatus = 'reply'
            })
        })

        this.hubConnection.on('ReceiveRemoteUser', async (request: CallRequest) => {
            await runInAction(() => {
                store.peerStore.remoteUser = request.user
                store.peerStore.remotePeerId = request.peerId
            })
        })

        this.hubConnection.on('CallAccepted', async (remotePeerId: string) => {
            await runInAction(async () => {
                store.peerStore.remotePeerId = remotePeerId
                store.peerStore.callStatus = 'calling'
                store.peerStore.makeCall()
            })
        })

        this.hubConnection.on('EndCall', async () => {
            store.peerStore.endCall()
        })

        await this.hubConnection.start().then(async () => {
            runInAction(() => {
                this.isConnected = true
            })
        });
    }

    setMessages(messages: Message[]) {
        this.messageGroup = {};
        for (const message of messages) {
            const dateKey = message.createdAtStr;

            if (!this.messageGroup[dateKey]) {
                this.messageGroup[dateKey] = [];
            }

            const exists = this.messageGroup[dateKey].some(m => m.messageId === message.messageId);
            if (!exists) {
                this.messageGroup[dateKey].push(message);
            }
        }
    }

    async joinConversation(conversationId: number) {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;

        this.currentConversationId = conversationId;
        this.messageGroup = {};
        await this.hubConnection.invoke('JoinConversation', conversationId);
    }


    async savePeerId(peerId: string) {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;

        await this.hubConnection.invoke('SavePeerId', peerId)
    }
    
    async sendCallRequest(remoteUserId: number) {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;

        runInAction(() => {
            store.peerStore.callStatus = 'pending'
        })

        console.log("remoteUserId: " + remoteUserId + ", currentPeerId: " + store.peerStore.peerId)
        
        await this.hubConnection.invoke('SendCallRequest', remoteUserId, store.peerStore.peerId)
    } 

    async acceptCall(remoteUserId: number) {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;
        
        runInAction(() => {
            store.peerStore.callStatus = 'calling'
        })

        await this.hubConnection.invoke('AcceptCall', remoteUserId, store.peerStore.peerId)
    }

    async endCall(remoteUserId: number) {
        if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) return;

        await this.hubConnection.invoke('EndCall', remoteUserId)
    }

    stopHubConnection() {
        if (this.hubConnection?.state === HubConnectionState.Connected) {
            this.hubConnection.stop()
                .catch(error => console.log(error));
        }
    }
}