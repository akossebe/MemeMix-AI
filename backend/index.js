const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/voice-to-meme', require('./routes/voiceToMeme'));
app.use('/api/context-reader', require('./routes/contextReader'));
app.use('/api/voice-to-meme', require('./routes/voiceToMeme'));
app.use('/api/voice-to-meme', require('./routes/voiceToMeme'));
app.use('/api/context-reader', require('./routes/contextReader'));
app.use('/api/status-remixer', require('./routes/statusRemixer'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur opérationnel 🚀' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur lancé sur http://0.0.0.0:${PORT}`);
});
