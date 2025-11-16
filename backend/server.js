import express from 'express';
import cors from 'cors';
import mockApi from './mockData.js';

const app = express();

app.use(cors());
app.use(express.json());

// GET: /api/sessions
// Returns a list of all session IDs/titles
app.get('/api/sessions', (req, res) => {
  res.json(mockApi.getSessions());
});

// GET: /api/new-chat
// Returns a new, unique session ID
app.get('/api/new-chat', (req, res) => {
  const newSession = mockApi.createNewSession();
  res.json({ 
    sessionId: newSession.id, 
    title: newSession.title,
    dateTime: newSession.dateTime
  });
});

// GET: /api/session/:id
// Returns the full conversation history for a session
app.get('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const history = mockApi.getSessionHistory(id);
  res.json({ history });
});

// POST: /api/chat/:id
// Accepts a user question, returns a mock response
app.post('/api/chat/:id', (req, res) => {
  const { id } = req.params;
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const response = mockApi.addMessage(id, question);
  res.json(response);
});

// --- NEW DELETE ENDPOINT ---
// DELETE: /api/session/:id
// Deletes a session and its chat history
app.delete('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const result = mockApi.deleteSession(id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// --- VERCEL EXPORT ---
// This line MUST be at the bottom for Vercel
export default app;