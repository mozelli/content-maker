const state = require('./state.js');
const google = require('googleapis').google;
const googleCredentials = require("./secrets/content-maker.json");
const imageDownloader = require("image-downloader");
const path = require("path");

async function robot() {
  const content = state.load();

  await fecthImagesOfAllSentences(content);
  await downloadAllImages(content);
  
  state.save(content);

  async function fecthImagesOfAllSentences(content) {
    for(const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0].keyword}`;
      sentence.images = await fetchGoogleAndReturnImagesLiks(query);
      sentence.googleSearchQuery = query;
    }
  }

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

  async function downloadAllImages(content) {
    content.downloadedImages = [];

    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      const images = content.sentences[sentenceIndex].images;

      for(let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];

        try {
          if(content.downloadedImages.includes(imageUrl)) {
            throw new Error("A imagem já foi baixada.")
          }
          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
          content.downloadedImages.push(imageUrl);
          console.log(`> [${sentenceIndex}][${imageIndex}] Baixou a imagem com sucesso! (${imageUrl})`);
          break;
        } catch(error) {
          console.log(`Erro ao baixar a imagem (${imageUrl}): ${error}.`)
        }
      }
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url: url,
      dest: path.join(__dirname, `/content/${fileName}`)
    })
  }
}

module.exports = robot;