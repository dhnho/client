type User = {
    userId: number;
    fullname: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    friendshipStatus?: string;
    avatar: string;
};

type Sender = {
    requestId: number;
    userId: number;
    fullname: string;
    avatar: string
};

type SearchResult = {
    userId: number;
    fullname: string;
    status: string;
    text: string;
};

type Message = {
    messageId: int;
    conversationId: int;
    senderId: int;
    avatar: string;
    content: string;
    messageType: string;
    senderName: string;
    createdAtStr: string;
    createdAt: Date;
};

type LatestMessage = {
    name: string;
    conversationId: number;
    content: string;
    createdAt: string;
    type: string;
    avatarUrl: string;
    senderName: string;
    isFromOtherUser: string;
    messageType: string;
};

type Conversation = {
    conversationId?: number
    name: string;
    memberUserIds: number[];
};

type GroupInfo = {
    conversationId: number
    name: string
    url: string
}

type ConversationGroup = {
    groupInfo: GroupInfo
    listMember: User[]
};

type forgotPasswordSchema = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
}

type CallRequest = {
    user: User
    peerId: string
}

type Image = {
    url: string
    publicId: string
}

type ToggleCamera = {
    type: 'toggle-camera',
    showRemoteCamera: boolean
}
