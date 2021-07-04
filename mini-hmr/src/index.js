const App = document.getElementById('app');

const render = () => {
  let content = require("./content.js").default;
  App.innerHTML = content;
}

render();

if (module.hot) {
  console.log("hot");
  module.hot.accept(["./content.js"], render);
}