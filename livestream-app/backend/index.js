import express from 'express';
import cors from 'cors';
import { ref, onValue } from "firebase/database";
import database from './firebase.js';

let message = "No messages yet!"

const readingRef = ref(database, 'reading');
onValue(readingRef, (snapshot) => {
  const data = snapshot.val();
  message = data;
});

const app = express();
const PORT = 3000;

// Enable CORS to allow requests from the frontend
app.use(cors());

// Sample endpoint
app.get('/message', (req, res) => {
  res.json({ message: message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function writeData() {
  const reference = ref(db, '/reading')
}