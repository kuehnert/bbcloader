import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../store";
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const availableFilename = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "available.json"
);
const groupId = "p05pn9jr";
const url = `http://ibl.api.bbci.co.uk/ibl/v1/groups/${groupId}/episodes`;
const qs = {
  rights: "web",
  page: 1,
  per_page: 200,
  initial_child_count: 1,
  availability: "available",
};
const oneDay = 1000 * 60 * 60 * 24;

export interface Available {
  id: string;
  programme: string;
  categories: string[];
  synopsis: string;
  dateAdded: number;
};

export interface AvailableState {
  lastCheck: number,
  available: Available[],
};

const initialState: AvailableState = {
  lastCheck: new Date("2020-01-01").getTime(),
  available: [],
};

export const availableSlice = createSlice({
  name: "available",
  initialState,
  reducers: {
    loadAvailableSuccess(state, action: PayloadAction<{available: Available[], lastCheck: number}>) {
      const { available, lastCheck } = action.payload;
      state.available = available;
      state.lastCheck = lastCheck;
    },
    fetchAvailableSuccess(state, action: PayloadAction<{ available: Available[], lastCheck: number }>) {
      const { available, lastCheck } = action.payload;
      state.available = available;
      state.lastCheck = lastCheck;
    }
  },
});

export const { fetchAvailableSuccess, loadAvailableSuccess } = availableSlice.actions;
export default availableSlice.reducer;

export const loadAvailable = (): AppThunk => async (dispatch, getState) => {
  let available;
  let lastCheck;

  // 1. load file if present, else start with empty array;
  try {
    const buffer = fs.readFileSync(availableFilename);
    available = JSON.parse(buffer.toString());
    if (available.length > 0) {
      lastCheck = available[0].addedOn;
    } else {
      lastCheck = new Date("2020-01-01").getTime();
    }
  } catch (error) {
    available = [];
  }

  // 2. check if we need to fetch new data: more than 1 day ago
  if (getState().available.lastCheck + oneDay < new Date().getTime()) {

  }
  try {
  } catch (error) {
    console.error(error);
    return;
  }

  dispatch(loadAvailableSuccess({available, lastCheck}));
}

export const fetchAvailable = (): AppThunk => async (dispatch, getState) => {
  let available;

  // 1. load file if present, else start with empty array;
  try {
    const buffer = fs.readFileSync(availableFilename);
    available = JSON.parse(buffer.toString());
  } catch (error) {
    available = [];
  }

  // 2. check if we need to fetch new data: more than 1 day ago
  if (getState().lastCheck + oneDay < new Date().getTime()) {

  }
  try {
  } catch (error) {
    console.error(error);
    return;
  }

  dispatch(fetchAvailableSuccess(available));
}

// const saveAvailable = (available) => {
//   fs.writeFileSync(availableFilename, JSON.stringify(available));
// };
