import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import backend from '../../api/backend';
import { AppThunk } from 'store';
import { setErrorAlert } from 'features/globals/globalSlice';

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
  isFilm: string;
  isFilmValue: boolean;
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
  },
});

export const { fetchDownloadsSuccess, fetchFinishedSuccess } = videoSlice.actions;
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
    dispatch(setErrorAlert(`Fehler beim Laden der abgeschlossenen Downloads.`));
    return;
  }

  dispatch(fetchFinishedSuccess(finished));
};
