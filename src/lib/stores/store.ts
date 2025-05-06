import { createContext } from "react";
import { UiStore } from "./uiStore";
import { MessageStore } from "./messageStore";
import { PeerStore } from "./peerStore";

interface Store {
    uiStore: UiStore
    messageStore: MessageStore
    peerStore: PeerStore
}

export const store: Store = {
    uiStore: new UiStore(),
    messageStore: new MessageStore(),
    peerStore: new PeerStore()
}

export const StoreContext = createContext(store);