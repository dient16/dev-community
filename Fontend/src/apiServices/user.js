import axios from './axios';

export const apiGetCurrentUser = () =>
    axios({
        url: `/user/current-user`,
        method: 'get',
        withCredentials: true,
    });

export const apiEditUserProfile = ({ userId, data }) =>
    axios({
        url: `/user/${userId}`,
        method: 'put',
        data,
        withCredentials: true,
    });
export const apiGetUserByUsername = (username) =>
    axios({
        url: `/user/${username}`,
        method: 'get',
        withCredentials: true,
    });
export const apiFollowUser = (userId) =>
    axios({
        url: `/user/follow/${userId}`,
        method: 'put',
        withCredentials: true,
    });
export const apiUnFollowUser = (userId) =>
    axios({
        url: `/user/unfollow/${userId}`,
        method: 'put',
        withCredentials: true,
    });
