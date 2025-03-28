import express, { Request, Response } from 'express';

// Create an Express app
const app = express();
const port = 3001;  // Different port for the backend

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for basic landing page
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
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
