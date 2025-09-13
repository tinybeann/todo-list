import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { connect } from './config/database.js';
import routeClient from './routes/client/index.route.js';

dotenv.config();
connect();

const app = express();
const port = 3000;

// Cho phép tất cả tên miền truy cập
app.use(cors());

// Nếu muốn giới hạn tên miền cụ thể:
// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

// Parse application/json
app.use(bodyParser.json());

// Routes
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
