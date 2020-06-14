import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import backend from '../../api/backend';
import { AppThunk } from 'store';
import { setErrorAlert, setSuccessAlert } from 'features/globals/globalSlice';

export interface Video {
  id: string;
  url: string;
  programme: string;
  series: number;
  episodeNumber: number;
  episodeTitle: string;
  filename: string;
  attempts: number;
  year: string;
  tagged: boolean;
  isFilm: boolean;
  downloaded?: boolean;
  downloadedAt?: Date;
}

type VideoSliceState = {
  downloads: Video[];
  finished: Video[];
};

const initialState = {
  downloads: [],
  finished: [],
};

export const videoSlice = createSlice({
  name: 'videos',
  initialState: initialState as VideoSliceState,
  reducers: {
    fetchDownloadsSuccess(state, action: PayloadAction<Video[]>) {
      state.downloads = action.payload;
    },
    fetchFinishedSuccess(state, action: PayloadAction<Video[]>) {
      state.finished = action.payload;
    },
    createVideoSuccess(state, action: PayloadAction<Video>) {
      state.downloads.push(action.payload);
    },
    updateVideoSuccess(state, action: PayloadAction<Video>) {
      const video = action.payload;
      const index = state.downloads.findIndex((v) => v.id === video.id);
      state.downloads[index] = video;
    },
    deleteVideoSuccess(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.downloads = state.downloads.filter((v) => v.id !== id);
    },
  },
});

export const {
  fetchDownloadsSuccess,
  fetchFinishedSuccess,
  createVideoSuccess,
  updateVideoSuccess,
  deleteVideoSuccess,
} = videoSlice.actions;
export default videoSlice.reducer;

export const fetchDownloads = (): AppThunk => async (dispatch) => {
  let downloads;
  try {
    const response = await backend.get('/videos');
    downloads = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der Downloads.`));
    return;
  }

  dispatch(fetchDownloadsSuccess(downloads));
};

export const fetchFinished = (): AppThunk => async (dispatch) => {
  let finished;
  try {
    const response = await backend.get('/finished');
    finished = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`error fetching downloads`));
    return;
  }

  dispatch(fetchFinishedSuccess(finished));
};

export const createVideo = (url: string): AppThunk => async (dispatch) => {
  let video;
  try {
    const response = await backend.post('/videos', { url });
    video = response.data;
  } catch (error) {
    console.error(error.response);
    dispatch(setErrorAlert(error.response.data.error));
    return;
  }

  dispatch(setSuccessAlert('download added'));
  dispatch(createVideoSuccess(video));
};

export const updateVideo = (values: Video): AppThunk => async (dispatch) => {
  let video;
  try {
    const response = await backend.patch(`/videos/${values.id}`, values);
    video = response.data;
  } catch (error) {
    console.error(error.response);
    dispatch(setErrorAlert(error.response.data.error));
    return;
  }

  dispatch(setSuccessAlert('download updated'));
  dispatch(updateVideoSuccess(video));
};

export const deleteVideo = (id: string): AppThunk => async (dispatch) => {
  try {
    await backend.delete(`/videos/${id}`);
  } catch (error) {
    console.error(error.response);
    dispatch(setErrorAlert(error.response.data.error));
    return;
  }

  dispatch(setSuccessAlert('download removed'));
  dispatch(deleteVideoSuccess(id));
};
