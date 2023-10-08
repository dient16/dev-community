// src/Login.js
import React, { useState } from 'react';
import './Login.scss';
import { apiLogin } from '~/apiServices';
import { useDispatch } from 'react-redux';
import { login } from '~/store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import path from '~/utils/path';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        const payload = { email: email, password: password };
        const response = await apiLogin(payload);
        if (response?.status === 'success') {
            dispatch(login({ isLoggedIn: true, token: response.accessToken, userData: response.userData }));
            toast.success('Login successful');
            navigate(`/${path.HOME}`);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className="login">
            <div className="login__form">
                <label className="login__label" htmlFor="email">
                    Email:
                </label>
                <input
                    className="login__input"
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="login__label" htmlFor="password">
                    Password:
                </label>
                <input
                    className="login__input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login__button" onClick={() => handleLogin()}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
