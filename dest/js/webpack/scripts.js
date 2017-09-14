import ready from './functions/ready';

// globals
import global from './scripts/global';

// vytvorime mapu kvuli dynamickemu spusteni modulu
let modulesMap = {
  nette: (options = {}) => {
    nette.init(Object.keys(options).length ? options : undefined);
  },
  global: global
};

let load = function (modules) {
  ready(() => {
    if (!Array.isArray(modules)) {
      modules = [modules];
    }

    modules.forEach(module => {
      if (typeof module == 'string') {
        modulesMap[module]({});
      } else {
        modulesMap[module.name](module.options);
      }
    });
  });
};

window.load = load;