import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { useGeminiAi } from './helpers/useGeminiAi.helper.js';
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

// console.log(await useGeminiAi("Hãy tạo ra một thời khóa biểu trong 7 ngày, mỗi ngày có 3-4 công việc. Trả về kết quả dưới dạng một **mảng JSON** (JSON Array). Mỗi phần tử trong mảng là một **JSON object**, đại diện cho một công việc. Mỗi đối tượng phải chứa các key sau: **'title'**, **'status'** (một trong các giá trị 'To Do', 'In Progress', 'Done'), **'content'**, **'listUser'** (mảng chứa 1 tên bất kỳ), **'priority'** (một trong các giá trị 'Low', 'Medium', 'High'), **'weekDay'** (một trong các giá trị từ 'monday' đến 'sunday'). Đừng trả về bất kỳ đoạn văn bản hay giải thích nào khác ngoài đoạn JSON."));
// Routes
routeClient(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
