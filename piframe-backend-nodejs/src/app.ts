import express, { Request, Response } from 'express';
import pool from './pic_db';
import './init_pic_db';

// Create an Express app
const app = express();
const port = 3001;  // Different port for the backend

// Middleware to parse JSON request bodies
app.use(express.json());

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

app.get('/', (req, res) => {
  res.json(data);
});

app.get('/api/items', (req, res) => {
  res.json(data);
});

app.post('/api/images', async (req, res) => {
  const { filepath, comment, avg_rgb } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO images (filepath, comment, avg_rbg) VALUES ($1, $2, $3) RETURNING *',
      [filepath, comment, avg_rgb]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting image metadata:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/images', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10; // default get 10 images at time to display to user
  const offset = parseInt(req.query.offset as string) || 0; // default 0

  try {
    const result = await pool.query(
      'SELECT * FROM images ORDER BY date_added DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/*// Route to handle data sent from the frontend (POST request)
app.post('/api/submit', (req: Request, res: Response): void => {
  const { name, email }: { name: string; email: string } = req.body;
  console.log('Received data:', { name, email });
  res.json({ message: `Data received: ${name}, ${email}` });
});*/

/*// Route for basic landing page
app.get('/', (req, res) => {
    //res.send('Welcome to the backend!');
    const data = { message: 'testing some .json message here!' };
    res.json(data);
});

// Route to send data to the frontend (GET request)
app.get('/api/data', (req: Request, res: Response): void => {
  const data = { message: "Hello from Node.js backend!" };
  res.json(data);
});

// Route to handle data sent from the frontend (POST request)
app.post('/api/submit', (req: Request, res: Response): void => {
  const { name, email }: { name: string; email: string } = req.body;
  console.log('Received data:', { name, email });
  res.json({ message: `Data received: ${name}, ${email}` });
});*/

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
