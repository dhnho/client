import { ChangeEvent, useEffect, useRef } from 'react';
import '../../assets/css/profile.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAccount } from '../../lib/hook/useAccount';
import { Controller, useForm } from 'react-hook-form';
import { provinces } from '../../lib/util/util';
import { profileSchema, ProfileSchema } from '../../lib/schemas/ProfileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { store } from '../../lib/stores/store';

type Props = {
    onShowProfile: () => void;
};

export default function Profile({ onShowProfile }: Props) {
    const inputPhotoRef = useRef<HTMLInputElement>(null);
    // const [startDate, setStartDate] = useState<Date>();
    const { currentUser, updateUser, updateAvatar } = useAccount();
    const { control, register, handleSubmit, reset, formState: { isDirty, isValid } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        mode: 'onTouched'
    });

    useEffect(() => {
        if (currentUser) {
            reset({
                ...currentUser
            });
        }
    }, [currentUser, reset]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        store.uiStore.isBusy();

        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            await updateAvatar.mutateAsync(formData, {
                onSuccess: () => {
                    store.uiStore.isIdle();
                    toast.success('Cập nhật thành công');
                },
                onError: (errors) => console.log(errors)
            });
        }
    };

    const onSubmittt = async (data: ProfileSchema) => {
        store.uiStore.isBusy();
        await updateUser.mutateAsync(data, {
            onSuccess: () => {
                reset();
                store.uiStore.isIdle();
                toast.success('Cập nhật thành công');
            }
        });
    };

    return (
        <div id="profile" className='d-flex justify-content-center align-items-center'>
            <div className="profile-wrapper m-3">
                <div className="d-flex profile-header">
                    <div className='position-relative'>
                        <img src={currentUser?.avatar ? currentUser?.avatar : "/images/user.png"} className="img-fluid rounded-circle" alt="" />
                        <input accept='image/*' onChange={handleFileChange} ref={inputPhotoRef} hidden type="file" name="" id="" />
                        <i onClick={() => inputPhotoRef.current?.click()}
                            className="fa-regular fa-pen-to-square cursor-pointer position-absolute bottom-0 end-0 bg-white rounded-circle">
                        </i>
                    </div>

                    <div className='d-flex flex-column align-self-center ms-2'>
                        <p className='m-0'>{currentUser?.fullname === null ? '<Người dùng mới>' : currentUser?.fullname}</p>
                        <p className='m-0 email'>{currentUser?.email}</p>
                    </div>

                    <i onClick={onShowProfile} className="cursor-pointer fa-solid fa-xmark ms-auto"></i>
                </div>

                <form onSubmit={handleSubmit(onSubmittt)} className='profile-form'>
                    <div className='control-form'>
                        <label>Họ tên</label>
                        <input type="text" {...register('fullname')} autoComplete='off' />
                    </div>
                    <div className='control-form'>
                        <label>Ngày sinh</label>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : null}
                                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : null)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="(dd-mm-yyyy)"
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100}
                                    maxDate={new Date()}
                                    showPopperArrow={false}
                                />
                            )}
                        />
                    </div>
                    
                    <div className='control-form'>
                        <label>Giới tính</label>
                        <select {...register('gender')}>
                            <option disabled value="" defaultChecked={true}>Chọn giới tính</option>
                            <option value="True">Nam</option>
                            <option value="False">Nữ</option>
                        </select>
                    </div>
                    <div className='control-form'>
                        <label>Email</label>
                        <input disabled type="text" {...register('email')} autoComplete='off' />
                    </div>
                    <div className='control-form'>
                        <label>Số điện thoại</label>
                        <input disabled type="text" {...register('phone')} autoComplete='off' />
                    </div>
                    <div className='control-form'>
                        <label>Địa chỉ</label>
                        <select {...register('address')}>
                            <option disabled value="" defaultChecked={true}>Chọn địa chỉ</option>
                            {provinces.map((province, index) => {
                                return <option key={index} value={province}> {province} </option>;
                            })}
                        </select>
                        {/* <input type="text" {...register('address')} /> */}
                    </div>

                    <button disabled={!isDirty || !isValid} type='submit' className="btn-profile-submit">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
}
