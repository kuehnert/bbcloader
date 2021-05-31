import { Download } from '../downloads/downloadSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import bbcApi from 'api/bbcApi';
import { setErrorAlert } from 'features/globals/globalSlice';
import authHeader from 'utils/authHeader';

export interface Status {
  downloadsActive?: boolean;
  currentDownload?: Download;
  shareAvailable?: boolean;
  lastUpdate?: Date;
  debug: boolean;
  env: { [key: string]: string };
}

const initialState: Status = {
  env: {},
  debug: true,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    fetchStatusSuccess(state, action: PayloadAction<Status>) {
      state.currentDownload = action.payload.currentDownload;
      state.downloadsActive = action.payload.downloadsActive;
      state.env = action.payload.env;
      state.lastUpdate = action.payload.lastUpdate;
      state.shareAvailable = action.payload.shareAvailable;
    },
    toggleDownloadsSuccess(state, action: PayloadAction<boolean>) {
      state.downloadsActive = action.payload;
    },
    setDebug(state, action: PayloadAction<boolean>) {
      state.debug = action.payload;
    },
  },
});

export const { fetchStatusSuccess, setDebug, toggleDownloadsSuccess } =
  statusSlice.actions;
export default statusSlice.reducer;

export const fetchStatus = (): AppThunk => async dispatch => {
  let status;
  try {
    const response = await bbcApi.get('/status', { headers: authHeader() });
    status = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der Statusanzeigen.`));
    return;
  }

  dispatch(fetchStatusSuccess(status));
};

export const toggleDownloads = (): AppThunk => async dispatch => {
  let status;
  try {
    const response = await bbcApi.post('/toggleDownloads', null, {
      headers: authHeader(),
    });
    status = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Error changing download state.`));
    return;
  }

  dispatch(toggleDownloadsSuccess(status));
};
