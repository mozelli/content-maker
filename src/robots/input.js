const readline = require('readline-sync');
const state = require('./state.js');

function robot() {
  const content = {
    maximumSentences: 7
  };
  askAndReturnForSearchTerm();
  state.save(content);
  //console.dir(content, {depth: null});

  function askAndReturnForSearchTerm() {
    let term = readline.question("Informe um termo de busca: ");
    let termSplited = term.split(" ");
    content.url = `https://en.wikipedia.org/wiki/${termSplited.join("_")}`;
  }
}

module.exports = robot;