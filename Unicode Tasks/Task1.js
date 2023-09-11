import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var endpoint = '';

function getEndpoint(req, res, next) {
    endpoint = req.body["word"];
    console.log(req.body["word"]);
    next();
  }
  app.use(getEndpoint);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/words1.html");
  });

app.post('/submit', async (req, res) => {
  try {
    var api_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${endpoint}`;
    console.log(api_url);
    const response = await axios.get(api_url);
    const apiData = response.data;
    console.log(response.data);

    if (response.status === 200) {
      // Parse the API response to extract word meanings
      const meanings = [];

      apiData.forEach((entry) => {
        const word = entry.word
        entry.meanings.forEach((meaning) => {
          const partOfSpeech = meaning.partOfSpeech || 'N/A';
          meaning.definitions.forEach((definition) => {
            meanings.push({
              definition : definition.definition || 'N/A',
            });
          });
        });
      });

      return res.json({ flashcards: meanings });
    } else {
      return res.status(404).json({ error: "Word not found in the dictionary" });
    }
}catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});