const path = require("path");
const robots = {
  input: require("./robots/input.js"),
  text: require("./robots/text.js"),
  state: require("./robots/state.js"),
  image: require("./robots/images.js")
}

async function start() {
  robots.input();
  await robots.text();
  await robots.image();

  /* Uncomment to see the content file in console
  const content = robots.state.load();
  console.dir(content, {depth: null});
  */
}

start();