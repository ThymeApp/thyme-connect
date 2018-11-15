function callMethod(name) {
  return function() {
    if (window.thyme[name]) {
      window.thyme[name](arguments);
    }

    if (!window.thymeConnect[name]) window.thymeConnect[name] = [];
    window.thymeConnect[name].push(arguments);
  }
}

function createMethod(name, func) {
  window.thyme[name] = func;

  if (window.thymeConnect[name]) {
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

