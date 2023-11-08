import axios from '../../axios';

export const apiCreatePost = (data) =>
    axios({
        url: '/post',
        method: 'post',
        data,
        withCredentials: true,
    });
export const apiUploadImage = (data) =>
    axios({
        url: `/post/upload-image`,
        method: 'post',
        data,
        withCredentials: true,
    });

export const apiGetPosts = (params) =>
    axios({
        url: '/post',
        method: 'get',
        params: { ...params },
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
export const apiSearchPost = (q) =>
    axios({
        url: `/post/search`,
        method: 'get',
        params: { q },
        withCredentials: true,
    });
