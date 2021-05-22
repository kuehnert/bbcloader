import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import availableReducer from "./features/available/availableSlice";

export const rootReducer = combineReducers({
  available: availableReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
