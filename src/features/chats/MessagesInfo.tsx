import { useParams } from "react-router";
import "../../assets/css/MessageInfo.css";
import { useMessage } from "../../lib/hook/useMessage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { store } from "../../lib/stores/store";
import { useConversation } from "../../lib/hook/useConversation";
import { toast } from "react-toastify";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

type Props = {
    hideInfo: () => void;
    avatar: string;
    name: string;
    type: string;
};

export default function MessagesInfo({ hideInfo, avatar, name, type }: Props) {
    const { id } = useParams();
    const { images } = useMessage(Number(id));
    const { updateAvatar, groupInfo, updateGroupName } = useConversation(undefined, Number(id));

    const inputPhotoRef = useRef<HTMLInputElement>(null);
    const closeModalBtnRef = useRef<HTMLButtonElement>(null);

    const [newGroupName, setNewGroupName] = useState<string>('');
    const [showGallery, setShowGallery] = useState(false)
    const [startIndex, setStartIndex] = useState(0)

    //Thay đổi ảnh đại diện nhóm
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!id) return;

        store.uiStore.isBusy();
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('conversationId', id);

            await updateAvatar.mutateAsync(formData, {
                onSuccess: () => {
                    store.uiStore.isIdle();
                    toast.success('Cập nhật thành công');
                },
                onError: (errors) => console.log(errors)
            });
        }
    };

    //Thay đổi tên nhóm
    const changeGroupName = async (name: string) => {
        store.uiStore.isBusy();
        await updateGroupName.mutateAsync(name, {
            onSuccess: () => {
                store.uiStore.isIdle();
                closeModalBtnRef.current?.click();
                toast.success("Đổi tên nhóm thành công");
            }
        });
    };

    const openGallery = (index: number) => {
        setShowGallery(true)
        setStartIndex(index)
    }

    useEffect(() => {
        if (groupInfo) {
            setNewGroupName(groupInfo.groupInfo.name);
        }
    }, [groupInfo]);

    return (
        <div className="position-relative" id="info">
            <button onClick={hideInfo} className="position-absolute top-0 start-0 btn fs-4 btn-back d-xl-none">
                <i className="fa-solid fa-angle-left"></i>
            </button>

            {
                groupInfo && <div className="d-flex flex-column align-items-center info-header position-relative">
                    <div className='position-relative d-inline-block'>
                        <img src={groupInfo.groupInfo.url ?? avatar} className="img-fluid rounded-circle" alt="" />
                        <input accept='image/*' onChange={handleFileChange} ref={inputPhotoRef} hidden type="file" name="" id="" />
                        <i hidden={type == 'private'} onClick={() => inputPhotoRef.current?.click()}
                            className="fa-regular fa-pen-to-square cursor-pointer position-absolute bottom-0 end-0 bg-white rounded-circle">
                        </i>
                    </div>

                    <h5 className='info-heading position-relative px-4'>
                        {groupInfo.groupInfo.name ?? name}

                        {type === 'group' &&
                            <i className="fa-regular fa-pen-to-square cursor-pointer ms-1 d-none position-absolute" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                        }
                    </h5>
                </div>
            }

            <div className="container-fluid p-0">
                <div className="row">
                    <div className="d-flex justify-content-between mb-2 p-0">
                        <p className="m-0" style={{ color: '#aaa' }}>Hình ảnh ({images?.length})</p>
                        <a onClick={() => openGallery(0)} className="m-0 fw-bold cursor-pointer" style={{ color: '#0A2689' }}>Tất cả</a>
                    </div>
                    {
                        images && images.slice(0, 6).map((image, index) => {
                            if (index === 5) {
                                return <div onClick={() => openGallery(0)} key={index} className="col-4 g-2 position-relative cursor-pointer">
                                    <div className="position-absolute gradient-overlay d-flex justify-content-center align-items-center">
                                        <span className="fs-3 fw-bold">+{images.length - 5}</span>
                                    </div>
                                    {/* <img src={image} className="info-image" alt="" /> */}
                                </div>;
                            }

                            return <div onClick={() => openGallery(index)} key={index} className="col-4 g-2 cursor-pointer">
                                <img src={image} className="info-image" alt="" />
                            </div>;
                        })
                    }
                </div>
            </div>

            {/* chage group name modal */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
                <div className="modal-dialog">
                    <div className="modal-content p-0">
                        <div className="modal-header border-0 pb-0">
                            <h3 className="modal-title fs-5" id="staticBackdropLabel">Thay đổi tên nhóm</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body position-relative">
                            <i className="ms-3 fa-solid fa-user-group position-absolute top-50 start-0 translate-middle-y"></i>
                            <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                                type="text" placeholder="Nhập tên nhóm mới"
                                className="mt-2 input-control" autoComplete="off" />
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <div className='group-btn-wrapper' style={{ margin: 0 }}>
                                <button ref={closeModalBtnRef} className='cancel-btn' data-bs-dismiss="modal">Hủy</button>
                                <button onClick={() => changeGroupName(newGroupName)} disabled={newGroupName === groupInfo?.groupInfo.name} className='group-btn'>Đồng ý</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                showGallery && images && <div className="position-fixed top-0 bottom-0 start-0 end-0 bg-black">
                    <div className="position-relative">
                        <button onClick={() => setShowGallery(false)} className="btn text-white position-absolute top-0 end-0 z-1 fs-4">
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <ImageGallery 
                            showPlayButton={false} 
                            showFullscreenButton={false}
                            startIndex={startIndex}
                            isRTL={true}
                            items={ images.map(image => {
                                return {
                                    original: image,
                                    thumbnail: image
                                }
                            })} 
                        />
                    </div>
                </div>
            }

        </div>
    );
}
