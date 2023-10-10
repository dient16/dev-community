import axios from '../../axios';

export const apiGetTags = () =>
    axios({
        url: '/tag',
        method: 'get',
        withCredentials: true,
    });
export const apiFollowTag = (tagId) =>
    axios({
        url: `/tag/follow/${tagId}`,
        method: 'put',
        withCredentials: true,
    });
export const apiUnfollowTag = (tagId) =>
    axios({
        url: `/tag/unfollow/${tagId}`,
        method: 'put',
        withCredentials: true,
    });
export const apiGetMyTags = () =>
    axios({
        url: `/tag/user`,
        method: 'get',
        withCredentials: true,
    });
