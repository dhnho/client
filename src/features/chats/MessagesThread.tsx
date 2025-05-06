
import { useLocation, useNavigate, useParams } from 'react-router';
import '../../assets/css/MessageThread.css';
import Message from '../../app/shared/Message';
import { FieldValues, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useMessage } from '../../lib/hook/useMessage';
import MessagesInfo from './MessagesInfo';
import { store } from '../../lib/stores/store';
import { useQueryClient } from '@tanstack/react-query';
import { useConversation } from '../../lib/hook/useConversation';
import Group from './Group';
import { runInAction } from 'mobx';

const MessagesThread = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();
    const { name, avatar, type } = location.state || {};

    const prevScrollHeight = useRef(0);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const inputPhotoRef = useRef<HTMLInputElement>(null);

    const [showCreatGroup, setShowCreatGroup] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPicker, setShowPicker] = useState(false);

    const { otherMemberId, sendImage, messages, isFetchingNextPage, fetchNextPage, hasNextPage } = useMessage(Number(id));
    const { groupInfo } = useConversation(undefined, Number(id));
    const { register, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm();

    const sendMessage = async (data: FieldValues) => {
        await store.messageStore.hubConnection?.invoke('SendMessage', {
            conversationId: id,
            content: data.content,
            type: 'text'
        });

        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }

        reset();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            setIsLoading(true);
            await sendImage.mutateAsync(formData, {
                onSuccess: async (data: { publicId: string, url: string; }) => {
                    await store.messageStore.hubConnection?.invoke('SendMessage', {
                        conversationId: id,
                        content: data.url,
                        type: 'image',
                        publicId: data.publicId
                    });
                },
                onSettled: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    const handleScroll = () => {
        if (!messageBoxRef.current) return;

        if (messageBoxRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
            prevScrollHeight.current = messageBoxRef.current.scrollHeight;
            fetchNextPage();
        }
    };

    const calling = async () => {
        if(otherMemberId)
            await store.messageStore.sendCallRequest(otherMemberId)
    };

    //Giữ vị trí croll khi load tin nhắn
    useEffect(() => {
        if (messageBoxRef.current && prevScrollHeight.current) {
            requestAnimationFrame(() => {
                if (!messageBoxRef.current) return;

                const diff = messageBoxRef.current.scrollHeight - prevScrollHeight.current;
                messageBoxRef.current.scrollTop = diff;
            });
        }
    }, [messages]);

    //Load tin nhắn
    useEffect(() => {
        const joinConnection = async () => {
            if (!messages) return;

            const conversationId = Number(id);

            if (conversationId !== store.messageStore.currentConversationId) {
                await store.messageStore.joinConversation(conversationId);
            }

            store.messageStore.setMessages(messages.pages.flat().reverse());
            requestAnimationFrame(() => {
                if (!messageBoxRef.current) return;

                messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
            });
        };

        joinConnection();

    }, [id, messages, store.messageStore.isConnected]);

    //Xử lí scroll khi có tin nhắn mới
    useEffect(() => {
        if (store.messageStore.latestMessage) {
            if (!messageBoxRef.current) return;
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;

            queryClient.refetchQueries({
                queryKey: ['latest']
            });
        }
    }, [store.messageStore.latestMessage, queryClient]);

    useEffect(() => {
        runInAction(() => {
            store.peerStore.remoteUserAvatar = avatar
        })
    }, [avatar])

    //Xử lí ẩn hiện trên nhiều màn hình
    const divRef = useRef(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    useEffect(() => {
        const checkVisibility = () => {
            if (divRef.current) {
                const style = window.getComputedStyle(divRef.current);
                setIsInfoVisible(style.display !== 'none');
            }
        };

        checkVisibility();
        window.addEventListener('resize', checkVisibility);

        return () => window.removeEventListener('resize', checkVisibility);
    }, [isInfoVisible]);

    if (!groupInfo) return;

    return (
        <div className="row g-0 position-relative">
            <div className={`${isInfoVisible ? "col-xl-8 d-xl-block d-none" : "d-flex col-12"} flex-column justify-content-between message-thread`} style={{ height: '100vh' }}>
                <div className='message-thread-wrapper flex-grow-1'>
                    <div className="d-flex justify-content-between message-thread-header">
                        <div className='d-flex align-items-center'>
                            <button onClick={() => navigate('/dashboard')}
                                className="btn fs-4 btn-back border-0 d-block d-sm-none me-2">
                                <i className="fa-solid fa-angle-left"></i>
                            </button>

                            <div className='friend-image-wrapper position-relative'>
                                <img src={groupInfo.groupInfo.url ?? avatar ?? "/images/user.png"} className="img-fluid rounded-circle friend-image" alt="" />
                            </div>
                            <p className='m-0 friend-name'>
                                {groupInfo.groupInfo?.name ?? name}
                                <br />
                                <span hidden={type != 'group'} className='fw-lighter' style={{ fontSize: '10px' }}>
                                    {groupInfo.listMember.length} thành viên
                                </span>
                            </p>
                        </div>

                        <ul className='contact-icon-group list-unstyled d-flex m-0'>
                            <li hidden={type == 'private'} onClick={() => setShowCreatGroup(true)}><i className="fa-solid fa-user-plus"></i></li>
                            <li hidden={type == 'group'} onClick={calling}><i className="fa-solid fa-phone"></i></li>
                            {/* <li className='mx-3'><i className="fa-solid fa-video"></i></li> */}
                            <li onClick={() => setIsInfoVisible(v => !v)} className='text-center'><i className="fa-solid fa-ellipsis-vertical"></i></li>
                        </ul>
                    </div>

                    <div className='message-thread-body position-relative' ref={messageBoxRef} onScroll={handleScroll}>
                        {
                            Object.entries(store.messageStore.messageGroup).map(([key, messages]) => {
                                return <div key={key}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <hr />
                                        <span className='timeline'>{key}</span>
                                        <hr />
                                    </div>

                                    <div className=''>
                                        {
                                            messages.map((message, index) => {
                                                return <Message key={message.messageId}
                                                    type={type}
                                                    prevSenderId={index === 0 ? 0 : messages[index - 1].senderId}
                                                    message={message} />;
                                            })
                                        }
                                    </div>
                                </div>;
                            })
                        }

                        
                    </div>
                </div>

                <div className='send-message-form'>
                    <form onSubmit={handleSubmit(sendMessage)} className='flex-grow-1 d-flex align-items-center'>
                        <input accept='image/*' onChange={handleFileChange} ref={inputPhotoRef} hidden type="file" name="" id="" />
                        <i onClick={() => inputPhotoRef.current?.click()}
                            className="fa-solid fa-paperclip cursor-pointer">
                        </i>

                        <input {...register('content', { required: true })} autoComplete='off' className='flex-grow-1' type="text" placeholder='Nhập tin nhắn........' />
                        
                        <div className='position-relative'>
                            <button onClick={() => setShowPicker(!showPicker)}><i className="fa-regular fa-face-smile"></i></button>
                            {/* <EmojiPicker searchDisabled className='position-absolute' style={{bottom: '40px', right: '0'}} /> */}
                        </div>
                        <button type='submit' disabled={ !isValid || isSubmitting }>
                            { !isLoading &&
                                <i className="fa-solid fa-location-arrow"></i>
                            }
                            
                            { isLoading && <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </button>
                    </form>
                </div>
            </div>
            

            {isInfoVisible && <div ref={divRef} className={`${isInfoVisible ? "col-xl-4 col-12 d-display" : "d-none"}`}>
                <MessagesInfo avatar={avatar} name={name} type={type} hideInfo={() => setIsInfoVisible(false)} />
            </div>}

            { showCreatGroup && 
                <Group setShowCreatGroup={() => {setShowCreatGroup(false)}} /> 
            }
        </div>
    );
});

export default MessagesThread;