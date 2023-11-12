import axios from '../../axios';

export const apiGetCurrentUser = () =>
    axios({
        url: `/user/current-user`,
        method: 'get',
        withCredentials: true,
    });

export const editUserProfile = ({ userId, data }) =>
    axios({
        url: `/user/${userId}`,
        method: 'put',
        data,
        withCredentials: true,
    });
