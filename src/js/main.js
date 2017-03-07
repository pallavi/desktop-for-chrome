'use strict';

function displayNotes() {
  document.getElementById('noteText').value = '';
  let noteList = document.getElementById('previousNotes');
  noteList.innerHTML = '';
  chrome.storage.sync.get('noteList', (data) => {
    if (data.noteList){
      for (var i = 0; i < data.noteList.length; i++) {
        let note = document.createElement('li');
        let del = document.createElement('button');
        let index = i;
        del.addEventListener('click', function() {
          let arr = data.noteList;
          arr.splice(index, 1);
          chrome.storage.sync.set({ 'noteList': arr }, displayNotes);
        })
        note.appendChild(document.createTextNode(data.noteList[i]));
        note.appendChild(del);
        console.log(note);
        noteList.appendChild(note);
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
        console.log(arr);
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
document.getElementById('clearNotes').addEventListener('click', clearNotes);
