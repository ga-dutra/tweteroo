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
    return res.status(400).send({ error: "Todos os campos são obrigatórios!" });
  }

  if (!checkUrl(avatar)) {
    return res.status(400).send({ error: "A imagem deve ser uma URL válida!" });
  }

  serverUsers.push(req.body);
  res.status(201).send({ message: "OK" });
});

function checkUrl(string) {
  try {
    let url = new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

server.get("/tweets", (req, res) => {
  const page = Number(req.query.page);

  if (!page || page < 1) {
    return res.status(400).send({ error: "Informe uma página válida!" });
  }

  if (page !== 1 && tweetsList.length < 10 * (page - 1)) return;

  const displayedTweets = tweetsList.map((tweet) => {
    const user = serverUsers.find((user) => user.username === tweet.username);
    return { avatar: user.avatar, ...tweet };
  });

  res.send(
    displayedTweets.length < 10
      ? displayedTweets
      : displayedTweets.slice(10 * (page - 1), 10 * page)
  );
});

server.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const username = req.headers.user;

  if (!tweet || !username) {
    return res.status(400).send({ error: "Todos os campos são obrigatórios!" });
  }

  const newTweet = { username: username, tweet: tweet };
  tweetsList.unshift(newTweet);
  res.status(201).send({ message: "OK" });
});

server.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const serverUsernames = serverUsers.map((user) => user.username);

  if (serverUsernames.indexOf(username) === -1) {
    res.status(404).send({ error: "O usuário deve ser válido!" });
  }

  const userTweets = tweetsList.map((tweet) => {
    const user = serverUsers.find((user) => user.username === tweet.username);
    return { avatar: user.avatar, ...tweet };
  });

  res.status(201).send(userTweets);
});

server.listen(5000, () => console.log("listening on port 5000"));
