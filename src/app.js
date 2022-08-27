import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

const serverUsers = [];
const tweetsList = [];

server.post("/sign-up", (req, res) => {
  console.log("tentei fazer login");
  console.log(req.body);
  const { username, avatar } = req.body;
  if (!username || !avatar) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  serverUsers.push(req.body);
  console.log(serverUsers);
  res.status(201).send("OK");
});

server.get("/tweets", (req, res) => {
  console.log("olá console");
  console.log(req.body);
  const displayedTweets = tweetsList.map((tweet) => {
    const user = serverUsers.find((user) => user.username === tweet.username);
    return { avatar: user.avatar, ...tweet };
  });
  res.send(
    displayedTweets.length < 10 ? displayedTweets : displayedTweets.slice(0, 10)
  );
});

server.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;
  if (!tweet || !username) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  const newTweet = { username: username, tweet: tweet };
  tweetsList.unshift(newTweet);
  res.status(201).send("OK");
});

server.listen(5000, () => console.log("listening on port 5000"));
