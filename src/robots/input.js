const readline = require('readline-sync');
const state = require('./state.js');

function robot() {
  const content = {
    maximumSentences: 7
  };
  askAndReturnForSearchTerm();
  state.save(content);

  function askAndReturnForSearchTerm() {
    let term = readline.question("Informe um termo de busca: ");
    let aux = term.split(" ");
    content.searchTerm = aux.join("_");
    content.url = `https://en.wikipedia.org/wiki/${content.searchTerm}`;
  }
}

module.exports = robot;