import { useState } from 'react';
import './EditProfile.scss';
import { Input, Avatar, Flex, message, Spin } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { apiGetCurrentUser, editUserProfile } from '~/apiServices';
import { useMutation } from '@tanstack/react-query';

function EditProfile() {
    const {
        handleSubmit,
        watch,
        getValues,
        control,
        formState: { errors },
    } = useForm({
        model: 'onBlur',
        defaultValues: async () => {
            const response = await apiGetCurrentUser();
            if (response.status === 'success') {
                const { _id, firstname, lastname, username, links, bio, avatar, skills, location, education, work } =
                    response.userData;
                return { _id, firstname, lastname, username, links, bio, avatar, skills, location, education, work };
            } else {
                return null;
            }
        },
    });

    const [avatar, setAvatar] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const mutationEditProfile = useMutation({
        mutationFn: (userId, data) => editUserProfile(userId, data),
    });
    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
        setPreviewAvatar(URL.createObjectURL(event.target.files[0]));
    };

    const handleEditInfo = (data) => {
        if (data.username) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            formData.append('image', avatar);

            mutationEditProfile.mutate(
                { userId: data._id, data: formData },
                {
                    onSuccess: (response) => {
                        if (response.status === 'success') {
                            message.success('User profile updated successfully');
                        } else {
                            message.error(response.message);
                        }
                    },
                },
            );
        }
    };

    return (
        <>
            <Spin size="large" spinning={mutationEditProfile.isPending} fullscreen={true}></Spin>
            <div className="settings-layout">
                <form onSubmit={handleSubmit(handleEditInfo)}>
                    <div className="settings__header">
                        <h1>Settings for @{watch('username')}</h1>
                    </div>

                    <div id="settings-form">
                        <div className="setting-fields">
                            <Flex align="center" gap={20}>
                                <div style={{ width: '100%' }}>
                                    <label htmlFor="name-input">First name</label>
                                    <Controller
                                        control={control}
                                        name="firstname"
                                        rules={{ required: 'Name is required' }}
                                        render={({ field }) => (
                                            <>
                                                <Input id="firstname" placeholder="John Doe" {...field} />
                                                {errors.firstname && (
                                                    <span className="error-message">{errors.firstname.message}</span>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <label htmlFor="name-input">Last name</label>
                                    <Controller
                                        control={control}
                                        name="lastname"
                                        rules={{ required: 'Name is required' }}
                                        render={({ field }) => (
                                            <>
                                                <Input xid="lastname" placeholder="John Doe" {...field} />
                                                {errors.lastname && (
                                                    <span className="error-message">{errors.lastname.message}</span>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </Flex>
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="username-input">Username</label>
                            <Controller
                                control={control}
                                name="username"
                                rules={{ required: 'Username is required' }}
                                render={({ field }) => (
                                    <>
                                        <Input id="username" placeholder="john_doe" {...field} />
                                        {errors.username && (
                                            <span className="error-message">{errors.username.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="avatar-input">Profile image</label>
                            <div className="avatar-field">
                                <span>
                                    <Avatar src={!previewAvatar ? getValues('avatar') : previewAvatar} size={40} />
                                </span>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    name="avatar"
                                    id="avatar-input"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="links-input">Website URL</label>
                            <Controller
                                control={control}
                                name="links"
                                render={({ field }) => (
                                    <>
                                        <Input id="links" placeholder="https://yoursite.com" {...field} />
                                        {errors.links && <span className="error-message">{errors.links.message}</span>}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="location-input">Location</label>
                            <Controller
                                control={control}
                                name="location"
                                render={({ field }) => (
                                    <>
                                        <Input id="location" placeholder="Binh Dinh, VietNam" {...field} />
                                        {errors.location && (
                                            <span className="error-message">{errors.location.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="bio-input">Bio</label>
                            <Controller
                                control={control}
                                name="bio"
                                rules={{ required: 'Bio is required' }}
                                render={({ field }) => (
                                    <>
                                        <Input.TextArea id="bio" placeholder="A short bio..." {...field} />
                                        {errors.bio && <span className="error-message">{errors.bio.message}</span>}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="skills-input">Skills</label>
                            <Controller
                                control={control}
                                name="skills"
                                rules={{ required: 'Skills is required' }}
                                render={({ field }) => (
                                    <>
                                        <Input.TextArea id="skills" placeholder="Currently hacking on.." {...field} />
                                        {errors.skills && (
                                            <span className="error-message">{errors.skills.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="education-input">Education</label>
                            <Controller
                                control={control}
                                name="education"
                                render={({ field }) => (
                                    <>
                                        <Input id="education" placeholder="Where did you go to school ?" {...field} />
                                        {errors.education && (
                                            <span className="error-message">{errors.education.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="work-input">Work</label>
                            <Controller
                                control={control}
                                name="work"
                                render={({ field }) => (
                                    <>
                                        <Input id="work" placeholder="What do you do ?" {...field} />
                                        {errors.work && <span className="error-message">{errors.work.message}</span>}
                                    </>
                                )}
                            />
                        </div>
                        <div className="setting-fields">
                            <label htmlFor="theme" style={{ marginBottom: '0.5rem' }}>
                                Theme
                            </label>
                            {/* <div className="color-picker">
                            <span style={{ backgroundColor: `${theme}` }}></span>
                            <HuePicker color={theme} onChangeComplete={handleThemeChange} />
                        </div> */}
                        </div>
                    </div>

                    <div className="settings-submit">
                        <button type="submit">Save Profile Information</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditProfile;
