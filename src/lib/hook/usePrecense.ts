import { useEffect, useRef } from "react"
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import { useLocalObservable } from "mobx-react-lite"
import { runInAction } from "mobx"

export const usePrecense = () => {
    const created = useRef(false);
    const precenseStore = useLocalObservable(() => ({
        onlineFriens: [] as User[],
        hubConnection: null as HubConnection | null,

        createHubConnection() {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_PRECENSE_URL}`, {
                    withCredentials: true,
                })
                .withAutomaticReconnect()
                .build()

            this.hubConnection.on('GetOnlineFriends', (friends: User[]) => {
                runInAction(() => {
                    this.onlineFriens = friends
                })
            })

            this.hubConnection.on('UserIsOnline', (userId: number) => {
                console.log(userId + ' is online')
            })

            this.hubConnection.on('GetOnlineFriends', (onlineFriends) => {
                console.log(onlineFriends)
            })

            this.hubConnection.on('UserIsOffline', (userId: number) => {
                console.log(userId + ' is offline')
            })
            
            this.hubConnection.start().catch(error =>
                console.log('Error establishing connection: ', error))
        },

        stopHubConnection() {
            if (this.hubConnection?.state === HubConnectionState.Connected) {
                this.hubConnection.stop().catch(error =>
                    console.log('Error stopping connection: ', error));
            }
        }
    }));

    useEffect(() => {
        if (!created.current) {
            precenseStore.createHubConnection();
            created.current = true;
        }

        return () => {
            precenseStore.stopHubConnection();
            precenseStore.onlineFriens = [];
        };
    }, [precenseStore]);

    return {
        precenseStore
    };
};