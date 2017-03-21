function startTime() {
  const today = new Date();
  const hours = convertToStandardHours(today.getHours());
  const minutes = addZeroes(today.getMinutes());
  document.getElementById('time').innerHTML = hours + ':' + minutes;
  setTimeout(startTime, 5000);
}

function convertToStandardHours(hrs) {
  return (hrs > 12 ? hrs - 12 : hrs);
}

function addZeroes(min) {
  return (min < 10 ? "0" + min : min);
}

startTime();
