import { GET_VIDEOS, GET_VIDEO, UPDATE_VIDEO, DELETE_VIDEO } from './types';

export const getVideos = (payload) => ({
    type: GET_VIDEOS,
    payload
})

export const getVideo = (payload) => ({
    type: GET_VIDEO,
    payload
})

export const updateVideo = (payload) => ({
    type: UPDATE_VIDEO,
    payload
})

export const deleteVideo = (payload) => ({
    type: DELETE_VIDEO,
    payload
})
