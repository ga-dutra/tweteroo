import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

server.get("/tweets", (req, res) => {
  res.send("olá");
  console.log("olá console");
});

server.listen(5000, () => console.log("listening on port 5000"));
