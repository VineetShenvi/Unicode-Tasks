import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/wordsDB");

const wordSchema = new mongoose.Schema({
    word: String,
    meaning: Array,
    synonyms: Array,
    antonyms: Array,
});

const Word = mongoose.model("Word", wordSchema);

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

  var meanings = [];
  var antonyms = [];
  var synonyms = [];
  var  output= [];
  var word = '';

app.post('/submit', async (req, res) => {
  try {
    var api_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${endpoint}`;
    console.log(api_url);
    const response = await axios.get(api_url);
    const apiData = response.data;
    console.log(response.data);

    if(endpoint.length<4){
        return res.status(406).json({ error: "Word is smaller then 4 characters" }); 
    }

    else if (response.status === 200) {

      apiData.forEach((entry) => {
        word = entry.word
        entry.meanings.forEach((meaning) => {
            meaning.synonyms.forEach((synonym) => {
                synonyms.push(
                  synonym
                );
              });

            meaning.antonyms.forEach((antonym) => {
                antonyms.push(
                    antonym
                );
              });
          meaning.definitions.forEach((definition) => {
            meanings.push(
              definition.definition
            );
          });
        });
      });

      antonyms = new Set(antonyms);
      antonyms = Array.from(antonyms);

      synonyms = new Set(synonyms);
      synonyms = Array.from(synonyms);


      const word_in_db = new Word({
        word: word,
        meaning: meanings,
        synonyms: synonyms,
        antonyms: antonyms,
    });

    output.push({word: word}, {meaning: meanings}, {synonyms: synonyms}, {antonyms: antonyms});

    word_in_db.save();
    } else {
      return res.status(404).json({ error: "Word not found in the dictionary" });
    }

    return res.json({ flashcards: output });
}catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});