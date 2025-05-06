import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useFriend = (querySearch?: string) => {

    const queryClient = useQueryClient()

    const { data: userSearchResult } = useQuery({
        queryKey: ['user', querySearch],
        queryFn: async () => {
            const response = await agent.get<User>(`/friend/search-friend?querySearch=${querySearch}`)
            return response.data;
        },
        enabled: !!querySearch,
        select: data => {
            return {
                ...data,
                status: data.friendshipStatus,
                text: data.friendshipStatus === 'stranger' ? 'Kết bạn' :
                         data.friendshipStatus === 'sent' ? 'Đã gửi' :
                         data.friendshipStatus === 'received' ? 'Đã nhận' :
                         data.friendshipStatus === 'friend' ? 'Bạn bè' : undefined
            }
        }
    })

    const { data: friends } = useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const response = await agent.get<User[]>('/friend/get-friends')
            return response.data
        }
    })

    const { data: senders } = useQuery({
        queryKey: ['senders'],
        queryFn: async () => {
            const response = await agent.get<Sender[]>('/friend/get-sender')
            return response.data
        }
    })

    const { data: suggestedUsers } = useQuery({
        queryKey: ['suggestion'],
        queryFn: async () => {
            const response = await agent.get<User[]>('/friend/get-suggest')
            return response.data
        }
    })

    const sendFriendRequest = useMutation({
        mutationFn: async (receiverId: number) => {
            await agent.post('/friend/make-friend?receiverId=' + receiverId )
        },
        onSuccess: async () => {
            await queryClient.setQueryData(['user', querySearch], (data: User) => {
                return {
                    ...data,
                    friendshipStatus: 'sent'
                }
            })
        }
    })

    const acceptFriendRequest = useMutation({
        mutationFn: async (requestId: number) => {
            await agent.post('/friend/accept-friend?requestId=' + requestId )
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['senders'] })
            await queryClient.refetchQueries({ queryKey: ['latest'] })
        }
    })

    const rejectFriendRequest = useMutation({
        mutationFn: async (requestId: number) => {
            await agent.delete('/friend/reject-friend?requestId=' + requestId )
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['senders']
            });
        }
    })

    return {
        userSearchResult,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        suggestedUsers,
        senders,
        friends
    }
}