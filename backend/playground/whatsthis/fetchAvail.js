const axios = require("axios");

async function fetch() {
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
  console.log(`Fetching data from ${url}`);
  const response = await axios.get(url, { params: qs });
  const programmes = response.data;
  const programmeCount = programmes.group_episodes.count;
  const episodes = programmes.group_episodes.elements;

  console.log("programmeCount", programmeCount);
  const prgs = episodes
    .map((e) => ({
      id: e.id,
      title: (e.editorial_title || e.title).trim(),
      categories: e.categories,
      synopsis: e.synopses.programme_small,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  const prgStr = prgs
    .map(
      (p) => `${p.id} ${p.title} (${p.categories.join(", ")}): ${p.synopsis}`
    )
    .join("\n");
  console.log(`programmes:\n${prgStr}`);
  console.log("programme detail", episodes[0]);
}

fetch();

// Docs:
// https://apiharmony-open.mybluemix.net/public/apis/bbc_iplayer_business_layer#get_groups__pid__episodes
