const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Place your Firebase service account key here

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

app.post('/feedback', async (req, res) => {
    try {
        const feedbackData = req.body;
        const docRef = await db.collection('feedback').add(feedbackData);
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

app.get('/feedback', async (req, res) => {
  try {
    // Fetch all documents from 'feedback' collection
    const snapshot = await db.collection('feedback').get();

    // Map documents to an array of objects with id and data
    const feedbackList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Send the array as JSON response
    res.json(feedbackList);
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});


const PORT = process.env.PORT || 3001;

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
