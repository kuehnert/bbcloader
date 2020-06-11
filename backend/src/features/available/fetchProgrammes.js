const axios = require("axios");
const {
  FETCH_AVAILABLE,
  FETCH_AVAILABLE_SUCCESS,
  FETCH_AVAILABLE_ERROR,
} = require("../messages");

process.on("message", ({ messageType, data }) => {
  if (messageType !== FETCH_AVAILABLE) {
    console.error("Invalid command:", messageType);
    return;
  }

  const groupId = "p05pn9jr";
  const url = `http://ibl.api.bbci.co.uk/ibl/v1/groups/${groupId}/episodes`;
  const qs = {
    rights: "web",
    page: 1,
    per_page: 200,
    initial_child_count: 1,
    availability: "available",
  };
  // recicpe: 240x135

  try {
    console.log(`Fetching data from ${url}`);
    const response = await axios.get(url, { params: qs });
    const programmes = response.data;
    const programmeCount = programmes.group_episodes.count;
    const episodes = programmes.group_episodes.elements;

    console.log("programmeCount", programmeCount);
    const prgs = episodes
      .map((e) => ({ id: e.id, title: (e.editorial_title || e.title).trim(), categories: e.categories, synopsis: e.synopses.programme_small }))
      .sort((a, b) => a.title.localeCompare(b.title));
    const prgStr = prgs.map((p) => `${p.id} ${p.title} (${p.categories.join(', ')}): ${p.synopsis}`).join("\n");
    console.log(`programmes:\n${prgStr}`);
    } catch (error) {
    console.error("Error!");
    process.send({ messageType: FETCH_AVAILABLE_ERROR, error });
    return;
  }

  process.send({ messageType: FETCH_AVAILABLE_SUCCESS, available });
});

// sort: 'SOME_STRING_VALUE',
// sort_direction: 'SOME_STRING_VALUE',
// mixin: 'SOME_ARRAY_VALUE'
