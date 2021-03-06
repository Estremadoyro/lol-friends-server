const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());
// Db Connection
const db = require("./db");
db();

//Routes
app.use("/api/v1.1/leaderboard", require("./routes/api/leaderboard"));
app.use("/api/v1.1/summoner", require("./routes/api/summoner"));
app.use("/", require("./routes/dummy"));
app.listen(PORT, (_req, _res) => {
  console.log(`Listening @ ${PORT}`);
});
