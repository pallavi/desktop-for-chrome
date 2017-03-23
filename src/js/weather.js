const WUNDERGROUND_KEY = 'ff970001b45a69ad';

navigator.geolocation.getCurrentPosition(
  function(data) {
    requestWeather(createUrl(data.coords.latitude, data.coords.longitude, 'conditions'), parseWeatherResponse);
  }
)

function createUrl(latitude, longitude, apiData) {
  return 'http://api.wunderground.com/api/' + WUNDERGROUND_KEY + '/' + apiData + '/q/' + latitude + ',' + longitude + '.json';
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
  const weather = JSON.parse(data).current_observation;
  requestWeather(createUrl(weather.display_location.latitude, weather.display_location.longitude, 'astronomy'), function(data) {
    let timeOfDay = getTimeOfDay(data);
    console.log(timeOfDay);
    //document.getElementById('city').innerHTML = weather.display_location.city + ', ' + weather.display_location.state;
    document.getElementById('temperature').innerHTML = weather.temp_f + '&deg;';
    document.getElementById('weather').innerHTML = weather.weather;
    displayWeather(weather.weather, timeOfDay);
  });
}

function displayWeather(weather, timeOfDay) {
  const window = document.getElementsByTagName('window')[0];
  const weatherImgDir = 'img/weather/';

  function addWeatherImg(filename) {
    const weatherImg = document.createElement('img');
    weatherImg.setAttribute('src', weatherImgDir + filename);
    window.appendChild(weatherImg);
  }

  if (weather === 'Clear' || weather === 'Partly Cloudy' || weather === 'Scattered Clouds') {
    if (weather !== 'Clear') {
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

    if (weather.indexOf('Thunderstorm') > -1) {
      addWeatherImg('lightning.png');
    }

    if (weather.indexOf('Rain') > -1 || weather.indexOf('Drizzle') > -1) {
      addWeatherImg('rainy.png');
    } else if (weather.indexOf('Snow') > -1 || weather.indexOf('Ice') > -1 || weather.indexOf('Hail') > -1) {
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
  data = JSON.parse(data);

  var sunrise = new Date();
  sunrise.setHours(data.sun_phase.sunrise.hour);
  sunrise.setMinutes(data.sun_phase.sunrise.minute);

  var sunset = new Date();
  sunset.setHours(data.sun_phase.sunset.hour);
  sunset.setMinutes(data.sun_phase.sunset.minute);

  var now = new Date();
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
