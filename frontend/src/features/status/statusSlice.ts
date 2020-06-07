import { Video } from '../videos/videoSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'store';
import backend from 'api/backend';
import { setErrorAlert } from 'features/globals/globalSlice';

export interface Status {
  currentVideo?: Video;
  externalIP?: string;
  isOnline?: boolean;
  lastUpdate?: Date;
}

const initialState: Status = {};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    fetchStatusSuccess(state, action: PayloadAction<Status>) {
      state.currentVideo = action.payload.currentVideo;
      state.externalIP = action.payload.externalIP;
      state.isOnline = action.payload.isOnline;
      state.lastUpdate = action.payload.lastUpdate;
    },
  },
});

export const { fetchStatusSuccess } = statusSlice.actions;
export default statusSlice.reducer;

export const fetchStatus = (): AppThunk => async (dispatch) => {
  let status;
  try {
    const response = await backend.get('/status');
    status = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der Statusanzeigen.`));
    return;
  }

  dispatch(fetchStatusSuccess(status));
};
