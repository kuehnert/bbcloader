import { Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import globalReducer from './features/globals/globalSlice';
import videoReducer from './features/videos/videoSlice';
import statusReducer from './features/status/statusSlice';

export const rootReducer = combineReducers({
  globals: globalReducer,
  status: statusReducer,
  videos: videoReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
