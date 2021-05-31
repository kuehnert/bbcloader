const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const Download = require('../models/download');
const fetchEpisodes = require('../utils/fetchEpisodes');
const createDownload = require('../utils/createDownload');
const startDownload = require('../utils/startDownload');
const { shareAvailable, getEnv } = require('../utils/shareAvailable');
const debug = require('../utils/debug');

// FETCH STATUS
router.get('/status', auth, async (req, res) => {
  console.log('downloadsActive', downloadsActive);
  console.log('global.downloadsActive', global.downloadsActive);

  const payload = {
    currentDownload,
    shareAvailable: shareAvailable(),
    lastUpdate: new Date(),
    downloadsActive,
    env: getEnv(),
  };

  debug(payload);
  res.send(payload);
});

router.post('/toggleDownloads', auth, async (req, res) => {
  console.log('Huhu!');
  global.downloadsActive = !global.downloadsActive;
  res.send(global.downloadsActive);
});

module.exports = router;
