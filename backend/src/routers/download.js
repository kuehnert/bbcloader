const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const fs = require('fs');
const Download = require('../models/download');
const fetchEpisodes = require('../utils/fetchEpisodes');
const createDownload = require('../utils/createDownload');

// FETCH STATUS
router.get('/status', auth, async (req, res) => {
  // await getExternalIP(updateExternalIP);
  const env = _.pick(
    process.env,
    'NODE_ENV',
    'DOWNLOAD_DIR',
    'DESTINATION_TV',
    'DESTINATION_MOVIES'
  );

  const shareAvailable = fs.existsSync(env.DOWNLOAD_DIR) && fs.existsSync(env.DESTINATION_MOVIES) && fs.existsSync(env.DESTINATION_TV);

  res.send({
    currentDownload: { _id: "dummy", url: "dummy", programme: "dummy" },
    shareAvailable,
    lastUpdate: new Date(),
    env,
  });
});

// FETCH ALL
router.get('/downloads', auth, async (_, res) => {
  try {
    const downloads = await Download.find({});
    res.send(downloads);
  } catch (error) {
    res.sendStatus(500);
  }
});

// CREATE
router.post('/downloads', auth, async (req, res) => {
  const { url } = req.body;

  if (url.match(/\/episodes\//)) {
    // Programme page
    const urls = await fetchEpisodes(url);
    const promises = Array();

    urls.forEach(u => {
      promises.push(createDownload(u));
    });

    let result = await Promise.all(promises);
    downloads = result.map(r => r.download).filter(e => e != null);
    errors = result.map(r => r.error).filter(e => e != null).map(e => ({ code: e.code, item: e.keyValue.url }));
    res.status(201).send({ downloads, errors });
  } else {
    // Individual video
    const { download, error } = await createDownload(url);
    if (download) {
      res.status(201).send({ downloads: [download], errors: [] });
    } else {
      res.status(201).send({ downloads: [], errors: [error].map(e => ({ code: e.code, item: e.keyValue.url })) });
    }
    // 11000 => duplicate key
  }
  // startNextDownload();
});

module.exports = router;
