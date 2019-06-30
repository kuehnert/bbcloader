import { GET_STATUS, GET_VIDEOS, GET_VIDEO, UPDATE_VIDEO, DELETE_VIDEO } from './types';
import backend from '../api/backend';

export const getStatus = () => async dispatch => {
	const response = await backend.get('/status');

	dispatch({
		type: GET_STATUS,
		payload: response.data,
	});
};

export const getVideos = () => async dispatch => {
	const response = await backend.get('/videos');

	dispatch({
		type: GET_VIDEOS,
		payload: response.data,
	});
};

export const getVideo = payload => ({
	type: GET_VIDEO,
	payload,
});

export const updateVideo = payload => ({
	type: UPDATE_VIDEO,
	payload,
});

export const deleteVideo = payload => ({
	type: DELETE_VIDEO,
	payload,
});
