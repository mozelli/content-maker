const readline = require('readline-sync');

function robot(content) {
  content.searchTerm = readline.question("Informe um termo de busca: ");
  content.url = `https://pt.wikipedia.org/wiki/${content.searchTerm}`;
}

module.exports = robot;