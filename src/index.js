require('dotenv/config');
const keyFile = require("./robots/secrets/content-maker.json");
// Importa a biblioteca do Google Cloud
const language = require('@google-cloud/language');
// Cria uma nova instância do cliente de Análise de Sentimento
const client = new language.LanguageServiceClient({
  keyFilename: "./src/robots/secrets/content-maker.json"  
});
// Define o texto que será analisado
const texto = "All of the fields on this page are optional and can be deleted at any time, and by filling them out, you're giving us consent to share this data wherever your user profile appears. Please see our privacy statement to learn more about how we use this information.";
// Cria a requisição para análise de sentimento
const document = {
  content: texto,
  type: 'PLAIN_TEXT',
};

// const robots = {
//   userInput: require("./robots/user-input"),
//   text: require("./robots/text.js")
// }
async function start() {
  const [result] = await client.analyzeEntities({ document });
  // Extrai as palavras-chave e imprime no console
  console.log('Palavras-chave:');
  result.entities.forEach(entity => {
    // console.log(`${entity.name} (${entity.salience.toFixed(2)})`);
    console.log(entity.name)
  });
  // const content = {};
  // robots.userInput(content);
  // await robots.text(content);

  // console.log(content);
}

start();