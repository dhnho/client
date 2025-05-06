import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useMessage = (conversationId?: number) => {

    const queryClient = useQueryClient()

    const { data: latestMessages } = useQuery({
        queryKey: ['latest'],
        queryFn: async () => {
            const response = await agent.get<LatestMessage[]>('/message/latest-message')
            return response.data
        }
    })

    const { data: images } = useQuery({
        queryKey: ['images', conversationId],
        queryFn: async () => {
            const response = await agent.get<string[]>('/message/images?conversationId=' + conversationId)
            return response.data.reverse()
        },
        enabled: !!conversationId
    })

    const { data: otherMemberId } = useQuery({
        queryKey: ['other', conversationId],
        queryFn: async () => {
            const response = await agent.get<number>('/conversation/other-member?conversationId=' + conversationId)
            return response.data
        },
        enabled: !!conversationId
    })

    const { data: messages, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<Message[]>({
        queryKey: ['messages', conversationId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await agent.get<Message[]>(
                `/message/get-message-list?conversationId=${conversationId}&pageNumber=${pageParam}`
            )
            return response.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length < 10 ? undefined : allPages.length + 1
        },
        enabled: !!conversationId,
    })

    // const { data: messages } = useQuery<Message[]>({
    //     queryKey: ['messages', conversationId, pageParam],
    //     queryFn: async () => {
    //         const response = await agent.get<Message[]>(
    //             `/message/get-message-list?conversationId=${conversationId}&pageNumber=${pageParam}`)

    //         return response.data
    //     },
    //     enabled: !!conversationId && !!pageParam,
    // })

    const sendImage = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await agent.post('/message/send-image', formData)
            return response.data
        },
        onSuccess: async (image: Image) => {
            await queryClient.setQueryData(['images', conversationId], (images: string[]) => {
                return [...images, image.url]
            })
        }
    })

    return {
        otherMemberId,
        latestMessages,
        messages,
        isFetchingNextPage, 
        fetchNextPage, 
        hasNextPage,
        sendImage,
        images
    };
};
