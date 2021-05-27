import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import backend from '../../api/bbcApi';
import { AppThunk } from '../../store';
import { setErrorAlert, setSuccessAlert } from 'features/globals/globalSlice';
import authHeader from 'utils/authHeader';

export interface Download {
  id: string;
  bbcID: string;
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

export interface Error {
  code: string;
  name?: string;
  item: string;
};

type DownloadSliceState = {
  downloads: Download[];
  finished: Download[];
  errors?: Error[];
};

const initialState = {
  downloads: [],
  finished: [],
};

export const downloadSlice = createSlice({
  name: 'downloads',
  initialState: initialState as DownloadSliceState,
  reducers: {
    fetchDownloadsSuccess(state, action: PayloadAction<Download[]>) {
      state.downloads = action.payload;
    },
    fetchFinishedSuccess(state, action: PayloadAction<Download[]>) {
      state.finished = action.payload;
    },
    createDownloadSuccess(state, action: PayloadAction<Download[]>) {
      state.downloads = state.downloads.concat(action.payload);
    },
    updateDownloadSuccess(state, action: PayloadAction<Download>) {
      const download = action.payload;
      const index = state.downloads.findIndex(v => v.id === download.id);
      state.downloads[index] = download;
    },
    deleteDownloadSuccess(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.downloads = state.downloads.filter(v => v.id !== id);
    },
  },
});

export const {
  fetchDownloadsSuccess,
  fetchFinishedSuccess,
  createDownloadSuccess,
  updateDownloadSuccess,
  deleteDownloadSuccess,
} = downloadSlice.actions;
export default downloadSlice.reducer;

export const fetchDownloads = (): AppThunk => async dispatch => {
  let downloads;
  try {
    const response = await backend.get('/downloads', { headers: authHeader() });
    downloads = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der Downloads.`));
    return;
  }

  dispatch(fetchDownloadsSuccess(downloads));
};

export const fetchFinished = (): AppThunk => async dispatch => {
  let finished;
  try {
    const response = await backend.get('/finished', { headers: authHeader() });
    finished = response.data;
  } catch (error) {
    dispatch(setErrorAlert(`error fetching downloads`));
    return;
  }

  dispatch(fetchFinishedSuccess(finished));
};

export const createDownload =
  (url: string): AppThunk =>
  async dispatch => {
    let downloads: Download[], errors: Error[], downloadCount = 0, errorCount = 0;
    try {
      const response = await backend.post(
        '/downloads',
        { url },
        { headers: authHeader() }
      );

      downloads = response.data.downloads;
      downloadCount = downloads.length;
      errors = response.data.errors;
      errorCount = errors.length;
    } catch (error) {
      // console.error(error.response);
      // dispatch(setErrorAlert(error.response.data.error));
      dispatch(setErrorAlert("Unkown error creating video"));
      return;
    }

    console.log('downloads:', downloads);
    console.log('errors:', errors);


    if (downloadCount > 0) {
      dispatch(setSuccessAlert(`${downloadCount} download${downloadCount > 1 ? 's' : ''} added`));
      dispatch(createDownloadSuccess(downloads));
    }

    if (errorCount > 0) {
      dispatch(setErrorAlert(`${errorCount} download${errorCount > 1 ? 's' : ''} not added`));
    }
  };

export const updateDownload =
  (values: Download): AppThunk =>
  async dispatch => {
    let download;
    try {
      const response = await backend.patch(`/downloads/${values.id}`, values, {
        headers: authHeader(),
      });
      download = response.data;
    } catch (error) {
      console.error(error.response);
      dispatch(setErrorAlert(error.response.data.error));
      return;
    }

    dispatch(setSuccessAlert('download updated'));
    dispatch(updateDownloadSuccess(download));
  };

export const deleteDownload =
  (id: string): AppThunk =>
  async dispatch => {
    try {
      await backend.delete(`/downloads/${id}`, { headers: authHeader() });
    } catch (error) {
      console.error(error.response);
      dispatch(setErrorAlert(error.response.data.error));
      return;
    }

    dispatch(setSuccessAlert('download removed'));
    dispatch(deleteDownloadSuccess(id));
  };
