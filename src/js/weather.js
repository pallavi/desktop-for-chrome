const WUNDERGROUND_KEY = 'ff970001b45a69ad';

navigator.geolocation.getCurrentPosition(
  function(data) {
    requestWeather(createUrl(data.coords.latitude, data.coords.longitude), parseWeatherResponse);
  }
)

function createUrl(latitude, longitude) {
  return 'http://api.wunderground.com/api/' + WUNDERGROUND_KEY + '/conditions/q/' + latitude + ',' + longitude + '.json';
}

function requestWeather(requestUrl, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open('GET', 'http://api.wunderground.com/api/ff970001b45a69ad/conditions/q/35.998744099999996,-78.93744269999999.json');
  xmlHttp.send(null);
}

function parseWeatherResponse(data) {
  const weather = JSON.parse(data).current_observation;
  document.getElementById('city').innerHTML = weather.display_location.city + ', ' + weather.display_location.state;
  document.getElementById('temperature').innerHTML = weather.temp_f + '&deg;F';
  document.getElementById('weather').innerHTML = weather.weather;
  document.getElementById('wind').innerHTML = weather.wind_string;
}
