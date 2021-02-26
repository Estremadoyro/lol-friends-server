const schedule = require('node-schedule');
const db = require('../db');
const axios = require('axios').default;
require('dotenv').config();
const { plb } = require('../functions/parseAPI');

(() => {
  db();
  

  const batchDB = async () => {
    const url = plb('la2', 'RANKED_SOLO_5x5', 'CHALLENGER', 1);
    try {
      const res = await axios.get(url);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  schedule.scheduleJob('*/1 * * * *', () => {
    batchDB();
  });
})();



