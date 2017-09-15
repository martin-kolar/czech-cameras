'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var roads,
      roadSelect,
      selectRoadFrom,
      selectRoadTo,
      selectRoadName,
      selectRefreshTime,
      camerasItems,
      timeoutsCounter = 0,
      finalCamerasUrl,
      lastReloadTime,
      refreshTime = 60;

  var sortNumber = function sortNumber(a, b) {
    return a - b;
  };

  var roadChange = function roadChange() {
    var numbers = filterRoadChange();

    if (typeof numbers[0][1] === 'string') {
      showStringOptions(numbers);
    } else {
      showNumbersOptions(numbers);
    }
  };

  var filterRoadChange = function filterRoadChange() {
    var numbers = [];

    [].concat((0, _toConsumableArray3.default)(cameraData)).forEach(function (row, i) {
      if (row[0] == roadSelect.value) {
        numbers.push(row);
      }
    });

    return numbers;
  };

  var roadNameChange = function roadNameChange() {
    var numbers = filterRoadChange(true);
    var finalCameras = [];

    [].concat((0, _toConsumableArray3.default)(numbers)).forEach(function (row, i) {
      if (row[1] === selectRoadName.value) {
        finalCameras.push(row);
      }
    });

    showFinalCameras(finalCameras);
  };

  var selectRoadRangeChange = function selectRoadRangeChange() {
    var rangeFrom = selectRoadFrom.value;
    var rangeTo = selectRoadTo.value;

    if (rangeFrom && rangeTo && rangeFrom <= rangeTo) {
      var numbers = filterRoadChange(true);
      var finalCameras = [];

      [].concat((0, _toConsumableArray3.default)(numbers)).forEach(function (row, i) {
        if (row[1] >= rangeFrom && row[1] <= rangeTo) {
          finalCameras.push(row);
        }
      });

      showFinalCameras(finalCameras);
    }
  };

  var showFinalCameras = function showFinalCameras(finalCameras) {
    var timestamp = Date.now();
    camerasItems.innerHTML = '';

    [].concat((0, _toConsumableArray3.default)(finalCameras)).forEach(function (camera, i) {
      var cameraLi = document.createElement('li');
      cameraLi.innerHTML = '<h2>' + returnCameraName(camera) + '</h2><img src="' + returnCameraUrl(camera, timestamp) + '">';
      camerasItems.appendChild(cameraLi);
    });

    finalCamerasUrl = finalCameras;
    lastReloadTime.innerHTML = new Date();
    setTimeoutForImages();
  };

  var reloadCameras = function reloadCameras() {
    var items = camerasItems.querySelectorAll('li');
    var timestamp = Date.now();

    if (items) {
      [].concat((0, _toConsumableArray3.default)(items)).forEach(function (el, i) {
        var itemImg = el.querySelector('img');
        itemImg.setAttribute('src', returnCameraUrl(finalCamerasUrl[i], timestamp));
      });
    }

    lastReloadTime.innerHTML = new Date();
    timeoutsCounter--;
    setTimeoutForImages();
  };

  var setTimeoutForImages = function setTimeoutForImages() {
    if (!timeoutsCounter) {
      setTimeout(reloadCameras, refreshTime * 1000);
      timeoutsCounter++;
    }
  };

  var returnCameraName = function returnCameraName(camera) {
    var returnText = camera[1];

    if (camera[4].trim() !== '') {
      returnText += ' (' + camera[4] + ')';
    }

    return returnText;
  };

  var returnCameraUrl = function returnCameraUrl(camera, timestamp) {
    if (camera[3] !== '') {
      return '/src/img.php?url=' + encodeURIComponent(camera[2]) + '&referer=' + camera[3] + '&time=' + timestamp;
    } else {
      return camera[2] + '&time=' + timestamp;
    }
  };

  var showNumbersOptions = function showNumbersOptions(numbers) {
    writeOptionsInSelect(selectRoadFrom, numbers, true);
    writeOptionsInSelect(selectRoadTo, numbers, true);

    selectRoadFrom.style.display = 'inline';
    selectRoadTo.style.display = 'inline';
    selectRoadName.style.display = 'none';
  };

  var showStringOptions = function showStringOptions(numbers) {
    writeOptionsInSelect(selectRoadName, numbers, false);

    selectRoadFrom.style.display = 'none';
    selectRoadTo.style.display = 'none';
    selectRoadName.style.display = 'inline';
  };

  var writeOptionsInSelect = function writeOptionsInSelect(select, numbers, withSorting) {
    select.options.length = 0;
    insertOption('Vyber', '', select);

    var writeOptions = [];

    [].concat((0, _toConsumableArray3.default)(numbers)).forEach(function (row, i) {
      if (writeOptions.indexOf(row[1]) === -1) {
        writeOptions.push(row[1]);
      }
    });

    if (withSorting) {
      writeOptions.sort(sortNumber);
    }

    [].concat(writeOptions).forEach(function (row, i) {
      insertOption(row, row, select);
    });
  };

  var insertOption = function insertOption(text, value, select) {
    var option = document.createElement('option');
    option.text = text;
    option.value = value;
    select.add(option);
  };

  var changeRefreshTime = function changeRefreshTime() {
    refreshTime = selectRefreshTime.value;
  };

  (0, _ready2.default)(function () {
    roads = [];
    roadSelect = document.querySelector('#select-road');
    selectRoadFrom = document.querySelector('#select-road-from');
    selectRoadTo = document.querySelector('#select-road-to');
    selectRoadName = document.querySelector('#select-road-name');
    camerasItems = document.querySelector('#cameras-items');
    lastReloadTime = document.querySelector('#last-reload-time');
    selectRefreshTime = document.querySelector('#select-reload-time');

    [].concat((0, _toConsumableArray3.default)(cameraData)).forEach(function (row, i) {
      if (roads.indexOf(row[0]) === -1) {
        roads.push(row[0]);

        insertOption(row[0], row[0], roadSelect);
      }
    });

    roadSelect.addEventListener('change', roadChange);
    selectRoadFrom.addEventListener('change', selectRoadRangeChange);
    selectRoadTo.addEventListener('change', selectRoadRangeChange);
    selectRoadName.addEventListener('change', roadNameChange);
    selectRefreshTime.addEventListener('change', changeRefreshTime);
  });
};

var _ready = require('../functions/ready');

var _ready2 = _interopRequireDefault(_ready);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;