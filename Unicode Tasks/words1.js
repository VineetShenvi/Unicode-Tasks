import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

var endpoint = "";

app.use(bodyParser.urlencoded({ extended: true }));

function getEndpoint(req, res, next) {
    endpoint = req.body["word"];
    console.log(req.body["word"]);
    next();
  }
  app.use(getEndpoint);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/words1.html");
});

app.post("/submit", (req, res) => {
  var full_url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + endpoint;
  console.log(full_url)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});