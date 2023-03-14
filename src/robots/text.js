const axios = require('axios');
const cheerio = require('cheerio');

async function robot(content) {
  await fetchContentFromWikipedia(content);
  scrapContentAndCreateSentences(content);
  sanitizeSentences(content);
  createSentences(content);
  

  async function fetchContentFromWikipedia(content) {
    const result = await axios(content.url);
    content.sourceContentOriginal = result.data;
  }

  function scrapContentAndCreateSentences(content) {
    const html = content.sourceContentOriginal;
    const $ = cheerio.load(html);
    let text = "";

    $('.mw-body-content .mw-parser-output p', html).each(function() {
      let item = $(this).text();
      text = text + item;
    });
    content.sourceContentOriginal = text;
  }

  function sanitizeSentences(content) {
    const contentClear = clear(content.sourceContentOriginal);
    content.sourceContentSanitized = contentClear;

    function clear(text) {
      const lines = text.split("\n");
      const reg = new RegExp(/\[[1-9]\]|\[[1-9][0-9]\]|\[[[:word:]][[:word:]][[:word:]][[:word:]][[:word:]]]/mg);
      
      const linesClear = lines.map((line) => {
        const result = line.replace(reg, "");
        const resultNoNotesBreackets = result.replace(/\[([a-zA-Z]{4}\s[1-9]\])/mg, "");
        return resultNoNotesBreackets.replace(".", ". ").trim();
      })
      return linesClear;
    }
  }

  function createSentences(content) {
    content.sentences = [];
    content.sourceContentSanitized.map((sentence) => {
      content.sentences.push({
        text: sentence,
        keyword: [],
        images: []
      });
    })
  }

  // const itemBreak = item.split(".")
  //     itemBreak.map((item2)  => {
  //       if(item2.length > 0){
  //         const reg = new RegExp(/\[[1-9]\]|\[[1-9][0-9]\]|\[[[:word:]][[:word:]][[:word:]][[:word:]][[:word:]]]/mg);
  //         const result = item2.replace(reg, "");
  //         const resultNobreack = result.replace(/\[([a-zA-Z]{4}\s[1-9]\])/mg, "");
  //         const resultNoSpaces = resultNobreack.trim();
  //         content.sentences.push(resultNoSpaces);
  //       }
  //     })
}

module.exports = robot