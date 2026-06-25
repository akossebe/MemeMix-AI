require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Voice-to-Meme Backend OK");
});

const PORT = 3000;


app.use(
  "/api/voice-to-meme",
  require("./routes/voiceToMeme")
);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});