const hotEmitter = require("./emitter");

let currentHash;
let lastHash;

const hotDownloadUpdateChunk = (chunkID) => {
  const script = document.createElement("script");

  script.charset = "UTF-8";
  script.src = `main.${lastHash}.hot-update.js`;
  document.head.appendChild(script);
}
const hotDownloadManifest = (chunkID) => {
  return new Promise((resolve, reject) => {
    const hotUpdatePath = `${chunkID}.${lastHash}.hot-update.json`;
    const xhr = new XMLHttpRequest();

    xhr.open("get", hotUpdatePath);
    xhr.onload = () => {
      let hotUpdate = JSON.parse(xhr.responseText);
      resolve(hotUpdate);
    };
    xhr.onerror = (error) => {
      reject(error);
    }
    xhr.send();
  })
}
const hotCheck = () => {
  hotDownloadManifest("main").then(hotUpdate => {
    const chunkIdList = Object.keys(hotUpdate.c);

    chunkIdList.forEach(chunkID => {
      hotDownloadUpdateChunk(chunkID);
    });
    lastHash = currentHash;
  }).catch(err => {
    window.location.reload();
  });
}
const hotCreateModule = (moduleID) => {
  const hot = {
    accept(deps = [], callback) {
      deps.forEach(dep => {
        hot._acceptedDependencies[dep] = callback || function () { };
      })
    },
    check: hotCheck
  }
  return hot;
}
window.webpackHotUpdatemini_hmr = (chunkID, moreModules) => {
  Object.keys(moreModules).forEach(moduleID => {
    let oldModule = __webpack_require__.c[moduleID];
    let newModule = __webpack_require__.c[moduleID] = {
      i: moduleID,
      l: false,
      exports: {},
      hot: hotCreateModule(moduleID),
      parents: oldModule.parents,
      children: oldModule.children
    };

    moreModules[moduleID].call(newModule.exports, newModule, newModule.exports, __webpack_require__);

    newModule.l = true;
    newModule.parents && newModule.parents.forEach(parentID => {
      let parentModule = __webpack_require__.c[parentID];
      parentModule.hot._acceptedDependencies[moduleID] && parentModule.hot._acceptedDependencies[moduleID]()
    });
  })
}

hotEmitter.on("webpackHotUpdate", (hash) => {
  currentHash = hash;

  if (!lastHash) {
    return lastHash = currentHash
  }
  
  hotCheck();
});

