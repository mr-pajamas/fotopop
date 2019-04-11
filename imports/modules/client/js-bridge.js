import query from './parsed-query.js';

function createBridge() {
  if (query.isAndroid && window.app) {
    return new Proxy(window.app, {
      get(target, p, receiver) {
        if (typeof target[p] === 'function') {
          return function (args) {
            if (args) return target[p](JSON.stringify(args));
            return target[p]();
          };
        }
        return Reflect.get(target, p, receiver);
      },
    });
  }
  if (query.isIOS && window.webkit && window.webkit.messageHandlers) {
    return new Proxy(window.webkit.messageHandlers, {
      get(target, p, receiver) {
        if (target[p] && typeof target[p].postMessage === 'function') {
          return function (args) {
            return target[p].postMessage(args);
          };
        }
        return Reflect.get(target, p, receiver);
      },
    });
  }
  return new Proxy({}, {
    get(target, p) {
      return function (args) {
        console.log(`Calling bridge function "${p}" with options: ${JSON.stringify(args)}`);
      };
    },
  });
}

export default createBridge();
