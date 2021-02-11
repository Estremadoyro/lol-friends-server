const express = require("express");
const router = express.Router();
const axios = require("axios");

const { RIOT_API } = require("../keys");

router.get("/leaderboard/challenger", async (req, res) => {
  console.log(RIOT_API.RIOT_API_LEADERBOARD);
  try {
    const players = "owo";
  } catch (err) {
    console.log(err);
  }
});

router.get("/leaderboard/grandmaster", async (req, res) => {
  return;
});

router.get("/leaderboard/master", async (req, res) => {
  return;
});
