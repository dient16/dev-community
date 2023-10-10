import axios from '../../axios';

export const apiCreatePost = (data) =>
    axios({
        url: '/post',
        method: 'post',
        data,
        withCredentials: true,
    });

export const apiGetPosts = () =>
    axios({
        url: '/post',
        method: 'get',
        withCredentials: true,
    });
export const apiGetPost = (pid) =>
    axios({
        url: `/post/${pid}`,
        method: 'get',
        withCredentials: true,
    });
export const apiLikePost = (pid) =>
    axios({
        url: `/post/like/${pid}`,
        method: 'put',
        withCredentials: true,
    });
export const apiUnlikePost = (pid) =>
    axios({
        url: `/post/unlike/${pid}`,
        method: 'put',
        withCredentials: true,
    });
