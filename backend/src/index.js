const fs = require('fs');
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

app.use(express.json());
app.use(cors());
app.use(log);
app.use(userRouter);
app.use(downloadRouter);

app.listen(port, () => {
  console.log('Server runnnig on port', port);
});

startNextDownload();
setInterval(() => {
  // check for downloads every five minutes
  startNextDownload();
}, 1000 * 60 * 5);
