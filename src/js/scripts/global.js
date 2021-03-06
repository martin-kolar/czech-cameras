import ready from '../functions/ready';

export default function (options = {}) {
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

  let sortNumber = function(a,b) {
    return a - b;
  }

  let roadChange = function() {
    let numbers = filterRoadChange();

    if (typeof numbers[0][1] === 'string') {
      showStringOptions(numbers);
    }
    else {
      showNumbersOptions(numbers);
    }
  };

  let filterRoadChange = function() {
    let numbers = [];

    [...cameraData].forEach((row, i) => {
      if (row[0] == roadSelect.value) {
        numbers.push(row);
      }
    });

    return numbers;
  }

  let roadNameChange = function() {
    let numbers = filterRoadChange(true);
    let finalCameras = [];

    [...numbers].forEach((row, i) => {
      if (row[1] === selectRoadName.value) {
        finalCameras.push(row);
      }
    });

    showFinalCameras(finalCameras);
  }

  let selectRoadRangeChange = function() {
    let rangeFrom = selectRoadFrom.value;
    let rangeTo = selectRoadTo.value;

    if (rangeFrom && rangeTo && rangeFrom <= rangeTo) {
      let numbers = filterRoadChange(true);
      let finalCameras = [];

      [...numbers].forEach((row, i) => {
        if (row[1] >= rangeFrom && row[1] <= rangeTo) {
          finalCameras.push(row);
        }
      });

      showFinalCameras(finalCameras);
    }
  }

  let showFinalCameras = function(finalCameras) {
    let timestamp = Date.now();
    camerasItems.innerHTML = '';

    [...finalCameras].forEach((camera, i) => {
      let cameraLi = document.createElement('li');
      cameraLi.innerHTML = `<h2>${returnCameraName(camera)}</h2><img src="${returnCameraUrl(camera, timestamp)}">`;
      camerasItems.appendChild(cameraLi);
    });

    finalCamerasUrl = finalCameras;
    lastReloadTime.innerHTML = new Date();
    setTimeoutForImages();
  }

  let reloadCameras = function() {
    let items = camerasItems.querySelectorAll('li');
    let timestamp = Date.now();

    if (items) {
      [...items].forEach((el, i) => {
        let itemImg = el.querySelector('img');
        itemImg.setAttribute('src', returnCameraUrl(finalCamerasUrl[i], timestamp));
      });
    }

    lastReloadTime.innerHTML = new Date();
    timeoutsCounter--;
    setTimeoutForImages();
  }

  let setTimeoutForImages = function() {
    if (!timeoutsCounter) {
      setTimeout(reloadCameras, (refreshTime * 1000));
      timeoutsCounter++;
    }
  }

  let returnCameraName = function(camera) {
    let returnText = camera[1];

    if (camera[4].trim() !== '') {
      returnText += ` (${camera[4]})`;
    }

    return returnText;
  }

  let returnCameraUrl = function(camera, timestamp) {
    if (camera[3] !== '') {
      return `/src/img.php?url=${encodeURIComponent(camera[2])}&referer=${camera[3]}&time=${timestamp}`;
    }
    else {
      return `${camera[2]}&time=${timestamp}`;
    }
  }

  let showNumbersOptions = function(numbers) {
    writeOptionsInSelect(selectRoadFrom, numbers, true);
    writeOptionsInSelect(selectRoadTo, numbers, true);

    selectRoadFrom.style.display = 'inline';
    selectRoadTo.style.display = 'inline';
    selectRoadName.style.display = 'none';
  }

  let showStringOptions = function(numbers) {
    writeOptionsInSelect(selectRoadName, numbers, false);

    selectRoadFrom.style.display = 'none';
    selectRoadTo.style.display = 'none';
    selectRoadName.style.display = 'inline';
  }

  let writeOptionsInSelect = function(select, numbers, withSorting) {
    select.options.length = 0;
    insertOption('Vyber', '', select);

    let writeOptions = [];

    [...numbers].forEach((row, i) => {
      if (writeOptions.indexOf(row[1]) === -1) {
        writeOptions.push(row[1]);
      }
    });

    if (withSorting) {
      writeOptions.sort(sortNumber);
    }

    [...writeOptions].forEach((row, i) => {
      insertOption(row, row, select);
    });
  }

  let insertOption = function(text, value, select) {
    let option = document.createElement('option');
    option.text = text;
    option.value = value;
    select.add(option);
  }

  let changeRefreshTime = function() {
    refreshTime = selectRefreshTime.value;
  }

  ready(() => {
    roads = [];
    roadSelect = document.querySelector('#select-road');
    selectRoadFrom = document.querySelector('#select-road-from');
    selectRoadTo = document.querySelector('#select-road-to');
    selectRoadName = document.querySelector('#select-road-name');
    camerasItems = document.querySelector('#cameras-items');
    lastReloadTime = document.querySelector('#last-reload-time');
    selectRefreshTime = document.querySelector('#select-reload-time');

    [...cameraData].forEach((row, i) => {
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
