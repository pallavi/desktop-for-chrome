function displayDate() {
	const today = new Date();
  const day = convertToWeekday(today.getDay());
	const month = convertToMonthName(today.getMonth());
  const date = today.getDate();
  document.getElementById('date').innerHTML = day + ' ' + month + ' ' + date;
}

function convertToWeekday(i) {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[i];
}

function convertToMonthName(i) {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return months[i];
}

function getEvents() {
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
}

function loadClient() {
  gapi.load();
  authorize();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: '966242545928-bt256f814gr0gmkcpjiisrshndsscqvs.apps.googleusercontent.com',
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
			let time = document.createElement('dt');
			let eventTime = formatTime(events[i].start.dateTime) + '-' + formatTime(events[i].end.dateTime);
			time.appendChild(document.createTextNode(eventTime));
			eventList.appendChild(time);

      let event = document.createElement('dd');
      let eventName = events[i].summary;
      event.appendChild(document.createTextNode(eventName));
      eventList.appendChild(event);
    }
  })
}

function formatTime(dateString) {
	const timeComponents = dateString.split('T')[1].split(':');
	var hours = parseInt(timeComponents[0]);
	var minutes = timeComponents[1];
	if (hours < 12) {
		if (hours == 0){
			hours = 12;
		}
		minutes = minutes + ' AM';
	}
	else {
		if (hours > 12){
			hours = hours - 12;
		}
		minutes = minutes + ' PM';
	}
	return hours + ':' + minutes;

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

displayDate();
getEvents();
