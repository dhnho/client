import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RegisterSchema } from "../schemas/RegisterSchema";
import agent from "../api/agent";
import { LoginSchema } from "../schemas/LoginSchema";
import { ProfileSchema } from "../schemas/ProfileSchema";
import { useNavigate } from "react-router";

export const useAccount = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const { data: currentUser, isLoading: loadingCurrentUser } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/get-profile')
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user']),
        // select: data => {
        //     return {
        //         ...data,
        //         gender: data.gender == 'True' ? '1' : '0'
        //     }
        // }
    });

    //Nhận otp từ server để xác thực email
    const checkEmail = useMutation({
        mutationFn: async (email: string) => {
            const response = await agent.get('/account/confirm-email?email=' + email);
            return response;
        }
    });

    //Check otp hợp lệ trước khi đổi mật khẩu
    const checkOTP = useMutation({
        mutationFn: async (schema: forgotPasswordSchema) => {
            const response = await agent.post('/account/confirm-otp', schema);
            return response;
        }
    });

    //Đổi mật khẩu
    const updatePassword = useMutation({
        mutationFn: async (schema: forgotPasswordSchema) => {
            const response = await agent.post('/account/change-password', schema);
            return response.data;
        }
    });

    //Check hợp lệ của email và sđt trước khi đăng ký
    const checkValidUser = useMutation({
        mutationFn: async (schema: RegisterSchema) => {
            const response = await agent.post('/account/check-valid', schema);
            return response;
        }
    });

    const registerUser = useMutation({
        mutationFn: async (schema: RegisterSchema) => {
            const response = await agent.post('/account/register', schema);
            return response.data
        }
    });

    const loginUser = useMutation({
        mutationFn: async (schema: LoginSchema) => {
            const response = await agent.post('/account/auth', schema);
            return response.data;
        },
        onSuccess: async (loginResponse) => {
            localStorage.setItem('loginResponse', JSON.stringify(loginResponse))
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });
        }
    });

    const updateUser = useMutation({
        mutationFn: async (schema: ProfileSchema) => {
            await agent.put('/account/update-profile', schema);
        },
        onSuccess: async (_, schema) => {
            await queryClient.setQueryData(['user'], (user: User) => {
                return {
                    ...user,
                    ...schema
                }
            })
        }
    });

    const updateAvatar = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await agent.put('/account/update-avatar', formData);
            return response.data
        },
        onSuccess: async (imageUrl: string) => {
            await queryClient.setQueryData(['user'], (user: User) => {
                return {
                    ...user,
                    avatar: imageUrl
                }
            })
        }
    })

    const logout = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout')
        },
        onSuccess: async () => {
            queryClient.removeQueries({ queryKey: ['user'] })
            localStorage.removeItem('loginResponse')
            navigate('/login')
        }
    })

    return {
        updateUser,
        checkValidUser,
        registerUser,
        loginUser,
        currentUser,
        loadingCurrentUser,
        updateAvatar,
        checkEmail,
        checkOTP,
        updatePassword,
        logout
    };
};