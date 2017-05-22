var TEMPERATURE_SCALE;
var TEMPERATURE_KELVIN;

function getTemperatureScale() {
  chrome.storage.sync.get('tempScale', (data) => {
    if (data.tempScale) {
      TEMPERATURE_SCALE = data.tempScale;
    } else {
      setTemperatureScale('F');
    }
  })
}

function setTemperatureScale(scale, update) {
  chrome.storage.sync.set({ 'tempScale': scale }, function () {
    TEMPERATURE_SCALE = scale;
    if (update) {
      updateTemperatureDisplay();
    }
  });
}

function addListenerToSwitchTemperatureScale() {
  let temperature = document.getElementById('temperature');
  temperature.addEventListener('click', function(event) {
    event.preventDefault();
    if (TEMPERATURE_SCALE == 'C') {
      setTemperatureScale('F', true);
    }
    else {
      setTemperatureScale('C', true);
    }
  });
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    function(data) {
      requestWeather(createUrl(data.coords.latitude, data.coords.longitude), parseWeatherResponse);
    }
  );
}

function createUrl(latitude, longitude) {
  return 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=fcf5e0c3d0ce4431f83d6595336c77b6';
}

function requestWeather(requestUrl, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open('GET', requestUrl);
  xmlHttp.send(null);
}

function parseWeatherResponse(data) {
  const response = JSON.parse(data);
  let timeOfDay = getTimeOfDay(response.sys);

  TEMPERATURE_KELVIN = response.main.temp;
  updateTemperatureDisplay();
  addListenerToSwitchTemperatureScale();
  document.getElementById('weather').innerHTML = response.weather[0].description;
  displayWeather(response.weather[0], timeOfDay);
}

function updateTemperatureDisplay() {
  document.getElementById('temperature').innerHTML = convertTemperature() + '&deg;';
}

function convertTemperature() {
  if (TEMPERATURE_SCALE == 'C') {
    // Kelvin to Celsius
    return Math.round(TEMPERATURE_KELVIN - 273.15);
  } else {
    // Kelvin to Fahrenheit
    return Math.round(TEMPERATURE_KELVIN * (9/5) - 459.67);
  }
}

function displayWeather(data, timeOfDay) {
  const window = document.getElementsByTagName('window')[0];
  const weatherImgDir = 'img/weather/';

  function addWeatherImg(filename) {
    const weatherImg = document.createElement('img');
    weatherImg.setAttribute('src', weatherImgDir + filename);
    window.appendChild(weatherImg);
  }

  const weather = data.main;
  const description = data.description;

  if (description === 'clear sky' || description === 'few clouds' || description === 'scattered clouds') {
    if (description !== 'clear sky') {
      addWeatherImg('partlycloudy.png');
    }

    if (timeOfDay === 'day') {
      addWeatherImg('sun.png');
    } else if (timeOfDay === 'night') {
      addWeatherImg('night.png');
      addWeatherImg('moon.png');
    } else {
      addWeatherImg('dawndusk.png');
    }
  }

  else {
    addWeatherImg('partlycloudy.png');
    addWeatherImg('cloudy.png');

    if (timeOfDay === 'night') {
      addWeatherImg('night.png');
    } else if (timeOfDay !== 'day') {
      addWeatherImg('dawndusk.png');
    }

    if (weather === 'Thunderstorm') {
      addWeatherImg('lightning.png');
      addWeatherImg('rainy.png');
    } else if (weather === 'Rain' || weather === 'Drizzle' || description.indexOf('storm') > -1 || description === 'hurricane') {
      addWeatherImg('rainy.png');
    } else if (weather === 'Snow') {
      addWeatherImg('snowy.png');
    }
  }
}

function addWeatherImg(window, imgUrl) {
  const weatherImg = document.createElement('img');
  weatherImg.setAttribute('src', imgUrl);
  window.appendChild(weatherImg);
}

function getTimeOfDay(data) {
  var now = new Date();

  var sunrise = new Date(data.sunrise * 1000);
  sunrise.setDate(now.getDate());

  var sunset = new Date(data.sunset * 1000);
  sunset.setDate(now.getDate());

  if (now < sunrise) {
    // Dawn is the 30 min period before sunrise
    return ((sunrise - now)/60000 < 30 ? 'dawn' : 'night');
  }
  else if (sunrise < now && now < sunset) {
    // Dusk starts 10 min before sunset
    return ((sunset - now)/60000 < 10 ? 'dusk' : 'day');
  }
  else {
    // Dusk ends 30 min after sunset
    return ((now - sunset)/60000 < 30 ? 'dusk' : 'night');
  }
}

getTemperatureScale();
getWeather();
