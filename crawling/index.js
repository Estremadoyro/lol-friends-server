const db = require('../db');
const NewModel = require('../models/news');
const axios = require('axios');
const cheerio = require('cheerio');


/**
  * Return a List of `New` from the first page of `surrenderat20`
  *
  * @typedef New
  * @property {string} title
  * @property {string} posted
  * @property {string} time
  * @property {string} summary
  * @property {string} banner
  * @property {string} url
  *
  *
  * @returns {Promise<New[]>}
  */
const craw = async () => {
  const result = await axios.get('https://www.surrenderat20.net')

  const news = [];

  if (result.status == 200) {
    const $ = cheerio.load(result.data);
    $('div.date-outer').each(async function(_, element) {
      const title = $(element).find('.news-title > a').text();
      const posted = $(element).find('abbr.published').first().text();
      const time = $(element).find('.news-date > b').first().text();

      const summariesNotClean = $(element).find('div.news-content').first().text().split(/\n+/);
      let summary = '';
      for (let posibleSummary of summariesNotClean) {
        if (posibleSummary.length >= summary.length) {
          summary = posibleSummary;
        }
      }

      const banner = $(element).find('div.separator > a > img').attr().src;
      const url = $(element).find('.news-title > a').attr().href;

      const data = {
        title,
        posted,
        time,
        summary,
        banner,
        url
      }
      news.push(data);
    });
  }

  return news;
}


const start = async () => {
  const news = await craw();
  for (let newData of news) {
    const newObject = new NewModel({...newData});
    await newObject.save();
  }
}

db();
start();
