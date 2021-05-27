import { Download } from '../downloads/downloadSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import bbcApi from 'api/bbcApi';
import { setErrorAlert } from 'features/globals/globalSlice';
import authHeader from 'utils/authHeader';

export interface Status {
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
      state.env = action.payload.env;
      state.shareAvailable = action.payload.shareAvailable;
      state.lastUpdate = action.payload.lastUpdate;
    },
    setDebug(state, action: PayloadAction<boolean>) {
      state.debug = action.payload;
    },
  },
});

export const { fetchStatusSuccess, setDebug } = statusSlice.actions;
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
