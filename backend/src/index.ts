import express from 'express';
import cors from 'cors';
import path from 'path';
import { adminRouter, publicRouter } from "@routes"
import { PORT, SERVER_URL } from '@config';


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`server running on ${SERVER_URL}:${PORT}`);
});
