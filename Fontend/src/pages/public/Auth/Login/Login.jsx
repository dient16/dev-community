// src/Login.js
import React from 'react';
import './Login.scss';
import { apiLogin } from '~/apiServices';
import { useDispatch } from 'react-redux';
import { login } from '~/store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import path from '~/utils/path';
import { Button, InputForm } from '~/components';

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

    const handleLogin = async (payload) => {
        const response = await apiLogin(payload);
        if (response?.status === 'success') {
            dispatch(login({ isLoggedIn: true, token: response.accessToken, currentUser: response.userData }));
            toast.success('Login successful');
            navigate(`/${path.HOME}`);
            reset();
        } else {
            toast.error(response.message);
        }
    };

    return (
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
    );
};

export default Login;
