import axios from './axios';

export const apiGetReliedComment = (commentId) =>
    axios({
        url: '/comment/reply/' + commentId,
        method: 'get',
        withCredentials: true,
    });
export const apiGetCommentPost = (postId) =>
    axios({
        url: '/comment/' + postId,
        method: 'get',
        withCredentials: true,
    });
export const apiAddComment = (postId, data) =>
    axios({
        url: '/comment/' + postId,
        method: 'post',
        data,
        withCredentials: true,
    });
export const apiDeleteComment = (commentId) =>
    axios({
        url: '/comment/' + commentId,
        method: 'delete',
        withCredentials: true,
    });
export const apiLikeComment = (commentId) =>
    axios({
        url: '/comment/like/' + commentId,
        method: 'put',
        withCredentials: true,
    });
export const apiUnlikeComment = (commentId) =>
    axios({
        url: '/comment/unlike/' + commentId,
        method: 'put',
        withCredentials: true,
    });
