const readLine = require('readline-sync');

function start() {
  const content = {};
  content.searchTerm = returnSearchTerm();

  function returnSearchTerm() {
    return readLine.question("Informe um termo de busca: ");
  }

  console.log(content);
}

start();