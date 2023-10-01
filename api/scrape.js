const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'URL parameter is missing.' });
    }

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Extract links from anchor tags within <div class="mozaique cust-nb-cols">
    const links = [];

    $('div.mozaique.cust-nb-cols a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && link.startsWith('/video')) {
        links.push(link);
      }
    });

    res.json({ links });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while scraping the website.' });
  }
};
