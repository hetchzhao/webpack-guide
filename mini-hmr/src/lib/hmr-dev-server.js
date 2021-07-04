const webpack = require('webpack');
const Server = require("./server/Server");
const config = require("../../webpack.config");

const compiler = webpack(config);
const server = new Server(compiler);

server.listen(8000, "localhost", () => {
  console.log(`Project is running at http://localhost:8000/`);
})