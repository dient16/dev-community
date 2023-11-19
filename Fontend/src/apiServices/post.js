import axios from './axios';

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
export const apiSearchPost = (q) =>
    axios({
        url: `/post/search`,
        method: 'get',
        params: { q },
        withCredentials: true,
    });
export const apiGetPostByTagDiscuss = (q) =>
    axios({
        url: `/post/tag-discuss`,
        method: 'get',
        withCredentials: true,
    });

export const apiBookmarkPost = (pid) =>
    axios({
        url: `/post/bookmark/${pid}`,
        method: 'put',
        withCredentials: true,
    });
export const apiUnbookmarkPost = (pid) =>
    axios({
        url: `/post/unbookmark/${pid}`,
        method: 'put',
        withCredentials: true,
    });
export const apiGetBookmarkUser = () =>
    axios({
        url: `/post/bookmark`,
        method: 'get',
        withCredentials: true,
    });
