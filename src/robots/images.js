const state = require('./state.js');
const google = require('googleapis').google;
const googleCredentials = require("./secrets/content-maker.json");

async function robot() {
  const content = state.load();
  await fecthImagesOfAllSentences(content);
  state.save(content);

  async function fecthImagesOfAllSentences(content) {
    for(const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0].keyword}`;
      sentence.images = await fetchGoogleAndReturnImagesLiks(query);
      sentence.googleSearchQuery = query;
    }
  }

  const imagesArray = await fetchGoogleAndReturnImagesLiks("Anya Taylor-Joy");
  // console.dir(content, { depth: null });
  // process.exit(0);

  async function fetchGoogleAndReturnImagesLiks(query) {
    const customSearch = google.customsearch('v1');
  
    const response = await customSearch.cse.list({
      auth: googleCredentials.api_key,
      cx: googleCredentials.search_engine_id,
      q: query,
      searchType: 'image',
      // imgSize: 'huge',
      num: 2
    });

    const imageUrl = response.data.items.map((item) => {
      return item.link
    });
    return imageUrl;
  }
}

module.exports = robot;