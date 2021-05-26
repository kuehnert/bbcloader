const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const fs = require('fs');
const Download = require('../models/download');

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
  const download = new Download(req.body);

  try {
    await download.save();
    res.status(201).send(download);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
