import axios from '../../axios';

export const apiRegister = (data) =>
    axios({
        url: '/auth/register',
        method: 'post',
        data,
        withCredentials: true,
    });
export const apiLogin = (data) =>
    axios({
        url: '/auth/login',
        method: 'post',
        data,
    });
export const apiForgotPassword = (data) =>
    axios({
        url: '/user/forgot-password',
        method: 'post',
        data,
    });
export const apiResetPassword = (data) =>
    axios({
        url: '/user/reset-password',
        method: 'put',
        data,
    });
