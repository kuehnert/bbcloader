import { GET_STATUS, GET_VIDEOS, GET_VIDEO, CREATE_VIDEO, UPDATE_VIDEO, DELETE_VIDEO, ADD_ERROR } from './types';
import backend from '../api/backend';
import history from '../history';

export const getStatus = () => async dispatch => {
  const response = await backend.get('/status');
  dispatch({ type: GET_STATUS, payload: response.data });
};

export const getVideos = () => async dispatch => {
  const response = await backend.get('/videos');
  dispatch({ type: GET_VIDEOS, payload: response.data });
};

export const getVideo = id => async dispatch => {
  try {
    const response = await backend.get(`/videos/${id}`);
    dispatch({ type: GET_VIDEO, payload: response.data });
  } catch (error) {
    dispatch({ type: DELETE_VIDEO, payload: id });
    dispatch({ type: ADD_ERROR, payload: error });
  }
};

export const createVideo = url => async dispatch => {
  const response = await backend.post('/videos', { url });
  dispatch({ type: CREATE_VIDEO, payload: response.data });
};

export const updateVideo = (id, formValues) => async dispatch => {
  const response = await backend.patch(`/videos/${id}`, formValues);
  dispatch({ type: UPDATE_VIDEO, payload: response.data });
  history.push('/');
};

export const deleteVideo = id => async dispatch => {
  await backend.delete(`/videos/${id}`);
  dispatch({ type: DELETE_VIDEO, payload: id });
};
