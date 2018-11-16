function callMethod(name) {
  return function() {
    if (window.thyme && window.thyme[name]) {
      return window.thyme[name].apply(null, arguments);
    }

    if (!window.thymeConnect) window.thymeConnect = {};

    if (!window.thymeConnect[name]) window.thymeConnect[name] = [];
    window.thymeConnect[name].push(arguments);
  }
}

function createMethod(name, func) {
  if (!window.thyme) window.thyme = {};

  if (window.thyme[name]) {
    throw new Error(name + ' is already registered.');
  }

  window.thyme[name] = func;

  if (window.thymeConnect && window.thymeConnect[name]) {
    window.thymeConnect[name].forEach(args => func.apply(null, args));
  }
}

module.exports = {
  registerComponent: callMethod('registerComponent'),
  injectEpic: callMethod('injectEpic'),
  registerReducer: callMethod('registerReducer'),
  registerSettingsPanel: callMethod('registerSettingsPanel'),
  registerColumn: callMethod('registerColumn'),
  registerColumns: callMethod('registerColumns'),
  invoke: createMethod,
};

