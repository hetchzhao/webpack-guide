const path = require("path");

module.exports = (compiler) => {
  const config = compiler.options;

  config.entry = {
    main: {
      import: [
        path.resolve(__dirname, "../client/index.js"),
        path.resolve(__dirname, "../client/dev-server.js"),
        ...config.entry.main.import
      ]
    }
  }

  compiler.hooks.entryOption.call(config.context, config.entry);
};

