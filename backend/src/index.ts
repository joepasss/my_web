import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './db';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/upload', upload.single('photo'), async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'cannot send file' });
    }

    const { filename } = req.file;

    const query = 'INSERT INTO photos (filename) VALUES ($1) RETURNING *';
    const values = [filename];

    const result = await pool.query(query, values);

    console.log('New photo saved:', result.rows[0]);
    res.status(200).json({
      message: 'upload success',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Upload ERROR:', err);
    res.status(500).json({ error: 'SERVER ERROR, cannot get photos' });
  }
})

app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('cannot get DB');
  }
});

app.get('api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `cannot find photo ${id}`});
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "SERVER ERROR, cannot get photo"})
  }
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
