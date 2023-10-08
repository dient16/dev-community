import axios from '../../axios';

export const apiCreatePost = (data) =>
    axios({
        url: '/post',
        method: 'post',
        data,
        withCredentials: true,
    });

export const apiGetPost = () =>
    axios({
        url: '/post',
        method: 'get',
        withCredentials: true,
    });
