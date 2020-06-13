import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'store';
import backend from 'api/backend';
import { setErrorAlert } from 'features/globals/globalSlice';

export interface Available {
  id: string;
  title: string;
  categories: string[];
  addedOn: number;
}

const initialState = {
  available: Array<Available>(),
};

export const availableSlice = createSlice({
  name: 'available',
  initialState,
  reducers: {
    fetchAvailableSuccess(state, action: PayloadAction<Available[]>) {
      state.available = action.payload;
    },
  },
});

export const { fetchAvailableSuccess } = availableSlice.actions;
export default availableSlice.reducer;

export const fetchAvailable = (): AppThunk => async (dispatch) => {
  let available;

  try {
    const response = await backend.get('/available');
    available = response.data as Available[];
  } catch (error) {
    dispatch(setErrorAlert(`Fehler beim Laden der verfügbaren Videos.`));
    return;
  }

  dispatch(fetchAvailableSuccess(available));
};
