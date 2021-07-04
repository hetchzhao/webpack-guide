const io = require("socket.io-client/dist/socket.io");
const hotEmitter = require("./emitter");

let currentHash;

const URL = "/";
const socket = io(URL);

const reloadApp = () => {
  let hot = true;

  if (hot) {
    hotEmitter.emit("webpackHotUpdate", currentHash);
  } else {
    window.location.reload();
  }
}

const onSocketMessage = {
  hash(hash) {
    console.log("hash",hash);

    currentHash = hash;
  },
  ok() {
    console.log("ok");

    reloadApp();
  },
  connect() {
    console.log("client connect successful");
  }
};

Object.keys(onSocketMessage).forEach(eventName => {
  socket.on(eventName, onSocketMessage[eventName]);
});
