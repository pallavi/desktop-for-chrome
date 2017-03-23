function displaySites() {
  //let sites = document.getElementById('favSites');
  //sites.innerHTML = '';
  chrome.topSites.get((data) => {
    for (var i = 0; i < data.length; i++) {
      console.log(i);
    }
    /*
    if (data.siteList){
      for (var i = 0; i < data.siteList.length; i++) {
        //let noteBackground = document.createElement('li');
        let site = document.createElement('div');
        //noteBackground.appendChild(note);
        site.appendChild(document.createTextNode(data.siteList[i]));

        let del = document.createElement('button');
        //del.appendChild(document.createTextNode('x'));
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
    */
  })
}

/*
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
*/

displaySites();
//document.getElementById('addSite').addEventListener('click', addNote);
//document.getElementById('clearNotes').addEventListener('click', clearNotes);
