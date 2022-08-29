import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

const serverUsers = [];
const tweetsList = [];

server.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  if (!username || !avatar) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  serverUsers.push(req.body);
  res.status(201).send("OK");
});

server.get("/tweets", (req, res) => {
  console.log(req.query);
  const page = Number(req.query.page);
  if (!page || page < 1) {
    return res.status(400).send("Informe uma página válida!");
  }
  if (page !== 1 && tweetsList.length < 10) return;
  console.log(`tweetsList: ${JSON.stringify(tweetsList)}`);
  const displayedTweets = tweetsList.map((tweet) => {
    const user = serverUsers.find((user) => user.username === tweet.username);
    return { avatar: user.avatar, ...tweet };
  });
  res.send(
    displayedTweets.length < 10 ? displayedTweets : displayedTweets.slice(0, 10)
  );
});

server.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const username = req.headers.user;

  if (!tweet || !username) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  const newTweet = { username: username, tweet: tweet };
  tweetsList.unshift(newTweet);
  res.status(201).send("OK");
});

server.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const serverUsernames = serverUsers.map((user) => user.username);
  if (serverUsernames.indexOf(username) === -1) {
    res.status(404).send("O usuário deve ser válido!");
  }
  const userTweets = tweetsList.map((tweet) => {
    const user = serverUsers.find((user) => user.username === tweet.username);
    return { avatar: user.avatar, ...tweet };
  });
  res.status(201).send(userTweets);
});

server.listen(5000, () => console.log("listening on port 5000"));
