import { Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import globalReducer from './features/globals/globalSlice';
import downloadReducer from './features/downloads/downloadSlice';
import statusReducer from './features/status/statusSlice';
import availableReducer from './features/available/availableSlice';
import userReducer from './features/users/userSlice';

export const rootReducer = combineReducers({
  available: availableReducer,
  globals: globalReducer,
  status: statusReducer,
  downloads: downloadReducer,
  users: userReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
