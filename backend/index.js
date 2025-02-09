import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",  // Allow frontend URL or all origins for testing
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(console.log("Monodb connectes successfully!!"))
  .catch((error) => console.log(error));

// Marker Schema
const MarkerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  info: String,
});

const Marker = mongoose.model('Marker', MarkerSchema);

// API to get markers
app.get('/markers', async (req, res) => {
  const markers = await Marker.find();
  res.json(markers);
});

// API to add a marker
app.post('/markers', async (req, res) => {
  const { lat, lng, info } = req.body;
  const newMarker = new Marker({ lat, lng, info });
  await newMarker.save();
  res.json(newMarker);
});

app.listen(port, () => console.log('Server running on port 5000'));