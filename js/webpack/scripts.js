'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _ready = require('./functions/ready');

var _ready2 = _interopRequireDefault(_ready);

var _global = require('./scripts/global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// vytvorime mapu kvuli dynamickemu spusteni modulu
var modulesMap = {
  nette: function (_nette) {
    function nette() {
      return _nette.apply(this, arguments);
    }

    nette.toString = function () {
      return _nette.toString();
    };

    return nette;
  }(function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    nette.init((0, _keys2.default)(options).length ? options : undefined);
  }),
  global: _global2.default
};

// globals


var load = function load(modules) {
  (0, _ready2.default)(function () {
    if (!Array.isArray(modules)) {
      modules = [modules];
    }

    modules.forEach(function (module) {
      if (typeof module == 'string') {
        modulesMap[module]({});
      } else {
        modulesMap[module.name](module.options);
      }
    });
  });
};

window.load = load;