const COLORS = [
  '#e8e8e8',  // light gray
  '#f9ebeb', // red
  '#ffe1b4', // orange
  '#fffce0', // yellow
  '#b6d88f', // green
  '#a3d6d1', // bluegreen
  '#bedae6', // blue
  '#dad0dc' // purple
]

function setupWall() {
  chrome.storage.sync.get('background', (data) => {
    if (data.background) {
      document.body.style.backgroundColor = data.background;
    } else {
      saveWallColor(COLORS[0]);
    }
  })
}

function showColorChoices() {
  let colorpicker = document.getElementById('colorpicker');
  for (var i = 0; i < COLORS.length; i++) {
    let color = document.createElement('button');
    color.style.background = COLORS[i];
    color.className += 'colorbutton';
    let index = i;
    color.addEventListener('click', function() {
      saveWallColor(COLORS[index]);
    });
    colorpicker.appendChild(color);
  }
}

function saveWallColor(color) {
  chrome.storage.sync.set({ 'background': color }, function () {
    document.body.style.backgroundColor = color;
  });
}

setupWall();
showColorChoices();
