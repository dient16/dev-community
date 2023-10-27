import React, { useEffect } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import path from '~/utils/path';
import { Button, InputForm } from '~/components';
import { useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiLogin } from '~/apiServices';
import { saveToLocalStorage } from '~/utils/helper';
const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: apiLogin,
        onSuccess: (data) => {
            toast.success('Login success');
            saveToLocalStorage('dev-community', {
                isLoggedIn: true,
                token: data.accessToken,
                currentUser: data.userData,
            });
            reset();
            navigate(`/${path.HOME}`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleLogin = (data) => {
        mutation.mutate(data);
    };

    // useEffect(() => {
    //     if (mutation.isError) {
    //         mutation.reset();
    //     }
    // }, [mutation.isError]);

    return (
        <Spin tip="Loading" size="large" spinning={mutation.isLoading || false}>
            <div className="login">
                <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
                    <h3 className="login__title">Login</h3>
                    <InputForm
                        id={'email'}
                        label="Email"
                        type="text"
                        register={register}
                        errors={errors}
                        validate={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                    />
                    <InputForm
                        id={'password'}
                        label="Password"
                        register={register}
                        errors={errors}
                        type="password"
                        validate={{
                            required: 'Password is required',
                            minLength: {
                                value: 3,
                                message: 'Password must be at least 6 characters',
                            },
                        }}
                    />
                    <Button type="submit" primary style={{ margin: '0' }}>
                        Login
                    </Button>
                </form>
            </div>
        </Spin>
    );
};

export default Login;
