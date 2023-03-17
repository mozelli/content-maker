const axios = require('axios');
const cheerio = require('cheerio');
const language = require('@google-cloud/language');
const sentenceBoundaryDetection = require('sbd')
const state = require('./state.js');

async function robot() {
  const content = state.load();
  await fetchContentFromWikipedia(content);
  scrapContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
  limitMaximumSenteces(content);
  await fetchKeywordsOfAllSentences(content);
  state.save(content);
  

  async function fetchContentFromWikipedia(content) {
    const result = await axios(content.url);
    content.sourceContentOriginal = result.data;
  }

  function scrapContentFromWikipedia(content) {
    const html = content.sourceContentOriginal;
    const $ = cheerio.load(html);
    let text = "";

    $('.mw-body-content .mw-parser-output p', html).each(function() {
      let item = $(this).text();
      text = text + item;
    });
    content.sourceContentOriginal = text;
  }

  function sanitizeContent(content) {
    const contentClear = clear(content.sourceContentOriginal);
    content.sourceContentSanitized = contentClear;

    function clear(text) {
      const lines = text.split("\n");
      const reg = new RegExp(/\[[1-9]\]|\[[1-9][0-9]\]|\[[[:word:]][[:word:]][[:word:]][[:word:]][[:word:]]]/mg);
      
      const withoutBlankLines = lines.filter((line) => {
        if(line.length == 0) {
          return false;
        }
        return true;
      });

      const linesClear = withoutBlankLines.map((line) => {
        const result = line.replace(reg, "");
        const resultNoNotesBreackets = result.replace(/\[([a-zA-Z]{4}\s[1-9]\])/mg, "");
        const resultNoParenthesis = resultNoNotesBreackets.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        return resultNoParenthesis;
      });

      return linesClear.join(" ");
    }
  }

  function breakContentIntoSentences(content) {
    content.sentences = []

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

  function limitMaximumSenteces(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  async function fetchKeywordsOfAllSentences(content) {
    for(const sentence of content.sentences) {
      sentence.keywords = await fetchGoogleAndReturnKeywords(sentence.text);
    }
  }

  async function fetchGoogleAndReturnKeywords(sentence) {
    //Cria uma nova instância do cliente de Análise de Sentimento
    const client = new language.LanguageServiceClient({
      keyFilename: "./src/robots/secrets/content-maker.json"  
    });
    const document = {
      content: sentence,
      type: 'PLAIN_TEXT',
    };
    return new Promise((resolve, reject) => {
      client.analyzeEntities({ document }).
      then(([result]) => {
        let keywords = result.entities.map((item) => {
          if(item.salience >= 0.05)
          return {keyword: item.name, salience: item.salience}
        })
        resolve(keywords);
      })
      .catch((error) => {
        reject(error);
      });
    }) 
  }
}

module.exports = robot