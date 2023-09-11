import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/words1.html");
  });

app.post('/submit', async (req, res) => {
  try {
    // Get the word from the request body
    const {word} = req.body;

    if (!word) {
        return res.status(400).json({ error: "Please provide a 'word' parameter in the request body" });
      }

    // Make a request to the Free Dictionary API
    const api_url = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`;
    const response = await axios.get(api_url);

    if (response.status === 200) {
      // Parse the API response to extract word meanings
      const meanings = [];
      const apiData = response.data;

      apiData.forEach((entry) => {
        entry.meanings.forEach((meaning) => {
          const partOfSpeech = meaning.partOfSpeech || 'N/A';
          meaning.definitions.forEach((definition) => {
            meanings.push({
              word,
              part_of_speech: partOfSpeech,
              definition: definition.definition || 'N/A',
            });
          });
        });
      });

      return res.json({ flashcards: meanings });
    } else {
      return res.status(404).json({ error: "Word not found in the dictionary" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});