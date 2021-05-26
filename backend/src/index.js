const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const downloadRouter = require('./routers/download');
const log = require('./middleware/log');

const app  = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(log)
app.use(userRouter);
app.use(downloadRouter);

app.listen(port, () => {
  console.log('Server runnnig on port', port);
});
