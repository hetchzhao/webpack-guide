const Koa = require('koa');
const http = require('http');
const mime = require('mime');
const path = require('path');
const socket = require('socket.io');
const MemoryFileSystem = require("memory-fs");

const updateCompiler = require("./updateCompiler");

class Server {
  constructor(compiler) {
    this.compiler = compiler;
    this.clientSocketList = [];
    this.currentHash;
    this.fs;
    this.server;
    this.app;
    this.middleware;

    updateCompiler(compiler);

    this.setupHooks();
    this.setupApp();
    this.setupDevMiddleware();
    this.routes();
    this.createServer();
    this.createSocketServer();
  }

  setupHooks() {
    this.compiler.hooks.done.tap("webpack-dev-server", stats => {
      console.log("stats.hash", stats.hash);

      this.currentHash = stats.hash;
      this.clientSocketList.forEach(socket => {
        socket.emit("hash", this.currentHash);
        socket.emit("ok");
      });
    });
  }

  setupApp() {
    this.app = new Koa();
  } 
  
  setupDevMiddleware() {
    this.compiler.watch({}, () => {
      console.log("Compiled successfully!");
    });

    this.fs = this.compiler.outputFileSystem = new MemoryFileSystem();

    this.middleware = (fileDir) => async (ctx, next) => {
      let url = ctx.url;

      if(url === '/favicon.ico') {
        ctx.status = 404;
        return;
      }

      url === "/" ? url = "/index.html" : null;
      
      const filePath = path.join(fileDir, url);;

      try {
        if(this.fs.statSync(filePath)) {
          const content = this.fs.readFileSync(filePath);

          ctx.set("Content-Type", mime.getType(filePath));
          ctx.body = content;
        } else {
          ctx.status = 404;
        }
      } catch (error) {
        ctx.status = 404;
      }
    };
  }

  routes() {
    const config = this.compiler.options;

    this.app.use(this.middleware(config.output.path));
  }
  
  createServer() {
    this.server = http.createServer(this.app.callback());
  }

  createSocketServer() {
    const socketIO = socket(this.server);

    socketIO.on("connection", socket => {
      console.log("a new client connect server");

      socket.on("disconnect", () => {
        const num = this.clientSocketList.indexOf(socket);

        this.clientSocketList = this.clientSocketList.splice(num, 1);
      });
      socket.emit('hash', this.currentHash);
      socket.emit('ok');

      this.clientSocketList.push(socket);
    });
  }

  listen(port, host = "localhost", cb = new Function()) {
    this.server.listen(port, host, cb);
  }
}

module.exports = Server;