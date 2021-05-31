const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const Download = require('../models/download');
const fetchEpisodes = require('../utils/fetchEpisodes');
const createDownload = require('../utils/createDownload');
const { shareAvailable, getEnv } = require('../utils/shareAvailable');

// FETCH STATUS
router.get('/status', auth, async (req, res) => {
  res.send({
    currentDownload,
    shareAvailable: shareAvailable(),
    lastUpdate: new Date(),
    env: getEnv(),
  });
});

// FETCH ALL
router.get('/downloads', auth, async (req, res) => {
  try {
    const downloads = await Download.find({ downloaded: false }).sort('orderIndex');
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

// UPDATE
router.patch('/downloads/:id', auth, async (req, res) => {
  const ALLOWED = ["attempts", "episodeNumber", "episodeTitle", "filename", "isFilm", "orderIndex", "programme", "series", "tagged", "year"];
  const patches = _.omit(req.body, ["addedAt", "bbcID", "downloaded", "url", "_id", "__v"]);
  const updates = Object.keys(patches);
  const isValid = updates.every(a => ALLOWED.includes(a));
  // console.log('patches', JSON.stringify(patches, null, 4));
  // console.log('isValid', isValid);

  if (!isValid) {
    const invalid = updates.filter(e => !ALLOWED.includes(e));
    console.log('Invalid attributes', JSON.stringify(invalid, null, 4));
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const download = await Download.findOneAndUpdate({ bbcID: req.params.id }, req.body, { new: true, runValidators: true, useFindAndModify: false });
    console.log('download', download);

    if (!download) {
      return res.sendStatus(404);
    }

    res.status(201).send(download);
  } catch (error) {
    console.log('error', error);
    res.sendStatus(500);
  }
});

router.delete('/downloads/:id', auth, async (req, res) => {
  try {
    const result = await Download.findOneAndDelete({ bbcID: req.params.id });
    if (result) {
      res.status(201).send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).send(error);
  }

});

module.exports = router;
