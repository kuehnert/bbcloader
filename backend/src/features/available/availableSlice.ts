import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const availableFilename = path.join(__dirname, '..', '..', '..', 'data', 'available.json');
const groupId = 'p05pn9jr';
const url = `http://ibl.api.bbci.co.uk/ibl/v1/groups/${groupId}/episodes`;
const qs = {
  rights: 'web',
  page: 1,
  per_page: 200,
  initial_child_count: 1,
  availability: 'available',
};
const oneDay = 1000 * 60 * 60 * 24;

interface ApiEpisode {
  categories: string[];
  editorial_title: string;
  tleo_id: string;
  programme: string;
  synopses: { [key: string]: string };
  title: string;
}

export interface Available {
  id: string;
  title: string;
  categories: string[];
  addedOn: number;
}

interface AvailableState {
  lastCheck: number;
  available: Available[];
}

const initialState: AvailableState = {
  lastCheck: new Date('2020-01-01').getTime(),
  available: [],
};

export const availableSlice = createSlice({
  name: 'available',
  initialState,
  reducers: {
    fetchAvailableSuccess(state, action: PayloadAction<{ available: Available[]; lastCheck: number }>) {
      const { available, lastCheck } = action.payload;
      state.available = available;
      state.lastCheck = lastCheck;
    },
    fetchAvailableFailed(state, action: PayloadAction<Available[]>) {
      state.available = action.payload;
    },
  },
});

export const { fetchAvailableSuccess, fetchAvailableFailed } = availableSlice.actions;
export default availableSlice.reducer;

export const fetchAvailable = (): AppThunk => async (dispatch, getState) => {
  let loaded, available;
  let lastCheck = new Date('2020-01-01').getTime(); // in the past

  // 1. load file if present, else start with empty array;
  try {
    const buffer = fs.readFileSync(availableFilename);
    loaded = JSON.parse(buffer.toString());
    if (loaded.length > 0) {
      lastCheck = loaded[0].addedOn;
    }
  } catch (error) {
    loaded = [];
  }

  // 2. check if we need to fetch new data: last check more than 1 day ago
  if (getState().available.lastCheck + oneDay < new Date().getTime()) {
    const groupId = 'p05pn9jr';
    const url = `http://ibl.api.bbci.co.uk/ibl/v1/groups/${groupId}/episodes`;
    const qs = {
      rights: 'web',
      page: 1,
      per_page: 200,
      initial_child_count: 1,
      availability: 'available',
    };

    try {
      console.log(`Fetching data from ${url}`);
      const response = await axios.get(url, { params: qs });
      const programmes = response.data;
      const programmeCount = programmes.group_episodes.count;
      const episodes = programmes.group_episodes.elements as ApiEpisode[];

      console.log('fetched programmeCount', programmeCount);
      available = episodes
        .map((e) => ({
          id: e.tleo_id,
          title: (e.editorial_title || e.title).trim(),
          categories: e.categories,
          synopsis: e.synopses.programme_small,
          addedOn: new Date().getTime(),
        }))
        .sort((a, b) => a.title.localeCompare(b.title)) as Available[];
      lastCheck = new Date().getTime();
      saveAvailable(available);
      // const prgStr = prgs.map((p) => `${p.id} ${p.title} (${p.categories.join(', ')}): ${p.synopsis}`).join('\n');
      // console.log(`programmes:\n${prgStr}`);
    } catch (error) {
      console.error('Error', error);
      dispatch(fetchAvailableFailed(loaded));
      return;
    }
  }

  dispatch(fetchAvailableSuccess({ available: available || loaded, lastCheck }));
};

const saveAvailable = (available: Available[]) => {
  fs.writeFileSync(availableFilename, JSON.stringify(available));
};
