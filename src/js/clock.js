function startTime() {
  const today = new Date();
  const hours = convertToStandardHours(today.getHours());
  const minutes = addZeroes(today.getMinutes());
  document.getElementById('time').innerHTML = hours + ':' + minutes;
  setTimePeriod(today.getHours());
  setTimeout(startTime, 5000);
}

function convertToStandardHours(hrs) {
  if (hrs == 0) {
    return 12;
  }
  return (hrs > 12 ? hrs - 12 : hrs);
}

function setTimePeriod(hrs) {
  if (hrs < 12) {
    document.getElementById('timeperiod').innerHTML = 'am';
  } else {
    document.getElementById('timeperiod').innerHTML = 'pm';
  }
}

function addZeroes(min) {
  return (min < 10 ? '0' + min : min);
}

startTime();
