const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require('body-parser');
const cors = require('cors');

database.connect();

const app = express();
const port = 3000;

// // Tất cả tên miền được phép truy cập vào
app.use(cors());

// Cho phép 1 tên miền cụ thể được phép truy cập
// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// }
// cors(corsOptions);

// parse application/json
app.use(bodyParser.json());

// Routes
const routeClient = require("./routes/client/index.route");
routeClient(app);


app.listen(port, () => {
  console.log(`app listening on port ${3000}`);
})