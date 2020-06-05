import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import backend from '../../api/backend';
import { AppThunk } from 'store';
import { setErrorAlert } from 'features/globals/globalSlice';

export interface Video {
  title: string;
  filename: string;
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
  },
});

export const { fetchDownloadsSuccess } = videoSlice.actions;
export default videoSlice.reducer;

export const fetchDownloads = (): AppThunk => async (dispatch) => {
  let downloads;
  try {
    const response = await backend.get('/downloads');
    downloads = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der Downloads.`));
    return;
  }

  dispatch(fetchDownloadsSuccess(downloads));
};
