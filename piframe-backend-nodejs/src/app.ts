import express from 'express';
import pool from './pic_db';
import multer, { FileFilterCallback } from 'multer';
import './init_pic_db';
import { spawn } from 'child_process';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Create an Express app
const app = express();
const port = 3001;  // Different port for the backend

//Middleware to parse JSON request bodies
app.use(express.json());
//middleware to allow any origin to make request to backend - is this safe for future largescale deployment?
app.use(cors());

//create directory to house images if it doesn't exist
// Define the uploads folder path
const uploadsDir = path.join(process.cwd(), 'uploads');

// Check if the folder exists; if not, create it
if (!fs.existsSync(uploadsDir)) 
{
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads folder');
} 
else 
{
  console.log('Uploads folder already exists');
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Define interface for Multer file
interface MulterRequestBody {
  comment: string;
}

//Need to decide if using this to type req
/*interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: MulterRequestBody;
}*/

//want crud operations for database
//post = create
//get = read
//put = update
//remove = delete

//Create image entry in database
//store imageid in react state for temporary storage thats cleared when page closes
// this will refresh whenever reload or reconnect to grab latest table data
app.post('/api/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  const {comment} = req.body;
  const currentDate = new Date();
  const path = 'uploads/';


  const avg_rgb = await get_avg_rgb(file?.path);
  //check to make sure avg_rgb != null, will catch stop this
  console.log('path:', path);
  console.log('comment:', comment);
  console.log('date:', currentDate);
  console.log('rgb:', avg_rgb);
  
  try {
    const result = await pool.query(
      'INSERT INTO images (filepath, date_added, comment, avg_rgb) VALUES ($1, $2, $3, $4) RETURNING *',
      [path, currentDate, comment, avg_rgb.avg_rgb] 
    );
    res.status(201).json(result.rows[0]);
    console.log('table id:', result.rows[0].id);
  } catch (err) {
    console.error('Error inserting image metadata:', err);
    res.status(500).json({ error: 'Internal Server Error' });
    //do I want to retry?
  }
});

//get all images from db
app.get('/api/images', async (req, res) => {
  try {
    const allImages = await pool.query("SELECT * FROM images");
    res.json(allImages.rows);
  } catch (err) {
    console.error('Error grabbing all image data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//read 1 image info from database, from id
app.get('/api/images/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE id=$1',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching image from id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Update image comment from ID
app.put('/api/images/:id', async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    const result = await pool.query(
      'UPDATE images SET comment = $1 WHERE id=$2 RETURNING *',
      [comment,id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error updating image from id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete image from id
app.delete('/api/images/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM images WHERE id = $1 RETURNING *',
      [id]
    );

    const deletedImage = result.rows[0];

    const fs = require('fs');
    fs.unlink(deletedImage.filepath, (err: any) => {
      if (err) console.error('Failed to delete file:', err.message);
    });

    res.json({ message: 'Image deleted', deletedImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Route for basic landing page
/*app.get('/', (req, res) => {
    //res.send('Welcome to the backend!');
    const data = { message: 'testing some .json message here!' };
    res.json(data);
});*/

//python function to get average color from image for backlight
function get_avg_rgb(imagePath: string | undefined): Promise<{ avg_rgb: number[] }> {
  return new Promise((resolve, reject) => {
    if(!imagePath)
    {
      return reject(new Error('No image path provided'));
    }

    const python = spawn('python', ['src/avg_rgb.py', imagePath]);

    let data = '';
    let error = '';

    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    python.on('close', (code) => {
      if (code !== 0 || error) {
        return reject(new Error(`Python error: ${error}`));
      }

      try {
        const result = JSON.parse(data);
        resolve(result);
      } catch (err) {
        reject(new Error('Failed to parse Python output'));
      }
    });
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
