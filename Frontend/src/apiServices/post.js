import { buildQueryString } from '~/utils/helper';
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

export const apiGetPosts = (params, location) => {
   const queryParams = buildQueryString({
      ...params,
      ...(location === '/top' ? { top: true } : {}),
      ...(location === '/latest' ? { latest: true } : {}),
   });

   return axios({
      url: `/post?${queryParams}`,
      method: 'get',
      withCredentials: true,
   });
};
export const apiGetPost = (pid, query) =>
   axios({
      url: `/post/${pid}` + (query ? `?fields=${query}` : ''),
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
export const apiGetPostByTagDiscuss = () =>
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
export const apiDeletePost = (postId) =>
   axios({
      url: `/post/${postId}`,
      method: 'delete',
      withCredentials: true,
   });
export const apiEditPost = ({ postId, data }) =>
   axios({
      url: `/post/${postId}`,
      method: 'put',
      data,
      withCredentials: true,
   });
