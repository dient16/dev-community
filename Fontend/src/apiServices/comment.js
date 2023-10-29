import axios from '../../axios';

export const apiGetReliedComment = (data, commentId) =>
    axios({
        url: '/comment/reply/' + commentId,
        method: 'get',
        data,
        withCredentials: true,
    });
export const apiAddComment = (postId, data) =>
    axios({
        url: '/comment/' + postId,
        method: 'post',
        data,
        withCredentials: true,
    });
