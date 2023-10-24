// src/Login.js
import React, { useEffect } from 'react';
import './Login.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import path from '~/utils/path';
import { Button, InputForm } from '~/components';
import { login } from '~/store/user/actionThunk';
import { Spin } from 'antd';
import { clearMessage } from '~/store/user/userSlice';

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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, message, isLoggedIn } = useSelector((state) => state.user);
    const handleLogin = async (payload) => {
        dispatch(login(payload));
    };
    useEffect(() => {
        if (isLoggedIn) {
            toast.success('Login success');
            reset();
            navigate(`/${path.HOME}`);
        } else {
            toast.error(message);
            dispatch(clearMessage());
        }
    }, [dispatch, message, isLoggedIn]);
    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className="login" onSubmit={handleSubmit(handleLogin)}>
                <form className="login__form">
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
