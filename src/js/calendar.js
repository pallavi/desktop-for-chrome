//oauth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
	  //load Google's javascript client libraries
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js?onload=loadClient';
    head.appendChild(script);
	}
);

function loadClient() {
  gapi.load();
  authorize();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: '684351759805-acrnrgfqhq33pcr6kdj654fp54ogu2km.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/calendar.readonly'
		},
		function(){
		  gapi.client.load('calendar', 'v3', displayEvents);
		}
	);
}

function displayEvents(){
  let today = new Date().toISOString();
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMax': getTomorrow(),
    'timeMin': getToday(),
    'orderBy': 'startTime',
    'singleEvents': true
  }).then(function(response) {
    let eventList = document.getElementById('eventList');
    let events = response.result.items;
    for (var i = 0; i < events.length; i++) {
      let event = document.createElement('li');
      let eventName = events[i].start.dateTime + '-' + events[i].end.dateTime + ': ' + events[i].summary;
      event.appendChild(document.createTextNode(eventName));
      eventList.appendChild(event);
    }
  })
}

function getToday() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

function getTomorrow() {
  let today = new Date();
  today.setHours(24, 0, 0, 0);
  return today.toISOString();
}
