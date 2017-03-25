function displayNotes() {
  document.getElementById('noteText').value = '';
  let noteList = document.getElementById('previousNotes');
  noteList.innerHTML = '';
  chrome.storage.sync.get('noteList', (data) => {
    if (data.noteList){
      for (var i = 0; i < data.noteList.length; i++) {
        let noteBackground = document.createElement('li');
        let note = document.createElement('div');
        note.className += 'scrollable';
        noteBackground.appendChild(note);
        note.appendChild(document.createTextNode(data.noteList[i]));

        let del = document.createElement('button');
        del.appendChild(document.createTextNode('x'));
        let index = i;
        del.addEventListener('click', function() {
          let arr = data.noteList;
          arr.splice(index, 1);
          chrome.storage.sync.set({ 'noteList': arr }, displayNotes);
        })
        noteBackground.addEventListener('mouseover', function() {
          del.style.display = 'block';
        });
        noteBackground.addEventListener('mouseout', function() {
          del.style.display = 'none';
        });
        noteBackground.appendChild(del);

        noteList.appendChild(noteBackground);
      }
    }
  })
}

function addNote() {
  var note = document.getElementById('noteText');
  let noteList = chrome.storage.sync.get('noteList', (data) => {
    if (!data.noteList) {
      chrome.storage.sync.set({ 'noteList': [note.value] }, displayNotes);
    } else {
      if (note.value !== '') {
        let arr = data.noteList;
        arr.push(note.value);
        chrome.storage.sync.set({ 'noteList': arr }, displayNotes);
      }
    }
  })
}

function clearNotes() {
  chrome.storage.sync.remove('noteList', displayNotes);
}

displayNotes();
document.getElementById('addNote').addEventListener('click', addNote);
document.getElementById('noteText').addEventListener('keypress', function (e) {
  if (e.keyCode === 13) {
    addNote();
  }
});
document.getElementById('clearNotes').addEventListener('click', clearNotes);
