const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require('body-parser');

database.connect();

const app = express();
const port = 3000;

const routeClient = require("./routes/client/index.route");

routeClient(app);

// parse application/json
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`app listening on port ${3000}`);
})