import axios from '../../axios';

export const apiGetCurrentUser = () =>
    axios({
        url: `/user/current-user`,
        method: 'get',
        withCredentials: true,
    });

export const editUserProfile = (uid, data) =>
    axios({
        url: `/user/${uid}`,
        method: 'put',
        data,
        withCredentials: true,
    });
