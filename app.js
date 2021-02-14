const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json({ limit: "50mb" }));

//Routes
app.use(require("./routes/leaderboard"));

app.listen(PORT, (req, res) => {
  console.log(`Listening @ ${PORT}`);
});
