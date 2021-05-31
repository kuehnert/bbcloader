const fs = require('fs-extra');
const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const downloadRouter = require('./routers/download');
const log = require('./middleware/log');
const startNextDownload = require('./utils/startDownload');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;
global.currentDownload = null;
global.downloadInterval = 1000 * 60 * process.env.DOWNLOAD_INTERVAL;

app.use(express.json());
app.use(cors());
app.use(log);
app.use(userRouter);
app.use(downloadRouter);

app.listen(port, () => {
  console.log('Server runnnig on port', port);
});

console.log(`Checking for downloads every ${downloadInterval/1000/60} minutes.`);
setInterval(() => {
  // check for downloads every x minutes
  startNextDownload();
}, downloadInterval);

startNextDownload();
