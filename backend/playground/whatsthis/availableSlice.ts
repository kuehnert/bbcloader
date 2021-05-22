import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { formatCategories } from '../../src/utils/formatters';
import { startOfDay, startOfToday } from 'date-fns';

const availableFilename = path.join(__dirname, '..', '..', '..', 'data', 'available.json');
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

export const fetchAvailable = (): AppThunk => async (dispatch) => {
  let available: Available[], fetched: Available[];
  let lastCheck = -1;

  // 1. load file if present, else start with empty array;
  try {
    const buffer = fs.readFileSync(availableFilename);
    available = JSON.parse(buffer.toString());
    if (available.length > 0) {
      lastCheck = available[0].addedOn;
    }
  } catch (error) {
    available = [];
    lastCheck = startOfDay(new Date('2020-01-01')).getTime(); // in the past
  }
  console.log(`loaded ${available.length} programmes`);

  // 2. check if we need to fetch new data: last check more than 1 day ago
  if (lastCheck + oneDay < new Date().getTime()) {
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

      console.log(`fetched ${programmeCount} programmes`);
      lastCheck = startOfToday().getTime();
      fetched = episodes.map(e => ({
        id: e.tleo_id,
        title: (e.editorial_title || e.title).trim(),
        categories: formatCategories(e.categories),
        synopsis: e.synopses.programme_small,
        addedOn: lastCheck,
      }));
      const oldIds = available.map(a => a.id);
      fetched = fetched
        .filter(a => !oldIds.includes(a.id))
        .sort((a, b) => a.title.localeCompare(b.title));
      console.log(`of these: ${fetched.length} are new`);

      available = fetched.concat(available);
      // available = available.map((a) => (a.downloaded = finished.find((v) => v.id === a.id)));
      saveAvailable(available);
      // const prgStr = prgs.map((p) => `${p.id} ${p.title} (${p.categories.join(', ')}): ${p.synopsis}`).join('\n');
      // console.log(`programmes:\n${prgStr}`);
    } catch (error) {
      console.error('Error', error);
      dispatch(fetchAvailableFailed(available));
      return;
    }
  }

  dispatch(fetchAvailableSuccess({ available, lastCheck }));
};

const saveAvailable = (available: Available[]) => {
  fs.writeFileSync(availableFilename, JSON.stringify(available));
};
