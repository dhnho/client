import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useConversation = (userId?: number, currentConversationId?: number) => { 
    const queryClient = useQueryClient()

    const { data: conversationId } = useQuery({
        queryKey: ['conversationId', userId],
        queryFn: async () => {
            const response = await agent.get<number>('/conversation/search-private?userId=' + userId)
            return response.data
        },
        enabled: !!userId && userId !== 0,
    })

    const { data: groupInfo } = useQuery({
        queryKey: ['groupInfo', currentConversationId],
        queryFn: async () => {
            const response = await agent.get<ConversationGroup>('/conversation/get-group-info?conversationId=' + currentConversationId)
            return response.data
        },
        enabled: !!currentConversationId
    })

    const { data: groups } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await agent.get<GroupInfo[]>('/conversation/get-group')
            return response.data
        }
    })

    const createConversation = useMutation({
        mutationFn: async (group: Conversation) => {
            const response = await agent.post('/conversation/create-group', group);
            return response.data
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['latest'] })
        }
    })

    const addMember = useMutation({
        mutationFn: async (group: Conversation) => {
            const response = await agent.post('/conversation/add-member', group)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['groupInfo', currentConversationId] })
        }
    })

    const updateAvatar = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await agent.put('/conversation/update-avatar', formData);
            console.log(response.data)
            return response.data
        },
        onSuccess: async (imageUrl: string) => {
            await queryClient.setQueryData(['groupInfo', currentConversationId], (group: ConversationGroup) => {
                return {
                    ...group,
                    groupInfo: {
                        ...group.groupInfo,
                        url: imageUrl
                    }
                }
            })

            await queryClient.setQueryData(['latest'], (latestMessages: LatestMessage[]) => {
                return latestMessages.map(message =>
                    message.conversationId === currentConversationId
                        ? { ...message, avatarUrl: imageUrl }
                        : message
                );
            })
        }
    })

    const updateGroupName = useMutation({
        mutationFn: async (name: string) => {
            const response = await agent.put('/conversation/update-name?conversationId=' + currentConversationId + '&name=' + name);
            return response.data
        },
        onSuccess: async (name: string) => {
            await queryClient.setQueryData(['groupInfo', currentConversationId], (group: ConversationGroup) => {
                return {
                    ...group,
                    groupInfo: {
                        ...group.groupInfo,
                        name: name
                    } 
                }
            })

            await queryClient.setQueryData(['latest'], (latestMessages: LatestMessage[]) => {
                return latestMessages.map(message =>
                    message.conversationId === currentConversationId
                        ? { ...message, name: name }
                        : message
                );
            })
        }
    })

    return {
        conversationId,
        createConversation,
        updateAvatar,
        updateGroupName,
        groupInfo,
        addMember,
        groups
    }
}