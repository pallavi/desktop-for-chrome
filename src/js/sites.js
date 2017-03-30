const POPULAR_SITES = [
  'amazon.com', 'drive.google.com', 'ebay.com', 'espn.com',
  'facebook.com', 'github.com', 'gmail.com', 'google.com',
  'huffpo.com', 'imgur.com', 'instagram.com', 'keep.google.com',
  'linkedin.com', 'messenger.com', 'netflix.com', 'pinterest.com',
  'reddit.com', 'stackoverflow.com', 'tumblr.com', 'twitter.com',
  'wikipedia.org', 'wordpress.com', 'yahoo.com', 'youtube.com'
];

function displaySites() {
  let siteList = document.getElementById('sites');
  siteList.innerHTML = '';
  chrome.storage.sync.get('siteList', (data) => {
    if (data.siteList) {
      for (var i = 0; i < data.siteList.length; i++) {
        let index = i;
        let site = data.siteList[i];
        let siteDiv = document.createElement('div');
        siteDiv.className += 'site';

        let siteLink = document.createElement('a');
        siteLink.href = site.siteUrl;

        var siteIcon;
        if (site.type === 'popular') {
          siteIcon = document.createElement('img');
          siteIcon.setAttribute('src', getImageUrl(site.siteUrl))
        }
        else {
          siteIcon = document.createElement('button');
          siteIcon.className += 'siteicon';
          siteIcon.appendChild(document.createTextNode(site.title));
          siteIcon.style.background = site.color;
        }

        let del = document.createElement('button');
        del.appendChild(document.createTextNode('x'));
        del.addEventListener('click', function() {
          let arr = data.siteList;
          arr.splice(index, 1);
          chrome.storage.sync.set({ 'siteList': arr }, displaySites);
        })
        siteDiv.addEventListener('mouseover', function() {
          del.style.display = 'block';
        });
        siteDiv.addEventListener('mouseout', function() {
          del.style.display = 'none';
        });

        siteLink.appendChild(siteIcon);
        siteDiv.appendChild(siteLink);
        siteDiv.appendChild(del);
        siteList.appendChild(siteDiv);
      }
    }
  })
}

function getImageUrl(siteLink) {
  return 'img/websites/' + siteLink.substring(11) + '.png';
}

function setupSitePicker() {
  let sitePickerContent = document.getElementById('sitePickerContent');
  for (var i = 0; i < POPULAR_SITES.length; i++) {
    let siteIcon = document.createElement('img');
    siteIcon.src = 'img/websites/' + POPULAR_SITES[i] + '.png';
    let index = i;
    siteIcon.addEventListener('click', function () {
      let site = {
        'type': 'popular',
        'siteUrl': 'http://www.' + POPULAR_SITES[index]
      }
      console.log(site);
      addSite(site);
      //closeSitePicker();
      displaySites();
    })
    sitePickerContent.appendChild(siteIcon);
  }
  document.getElementsByClassName("close")[0].addEventListener('click', closeSitePicker);
  document.getElementById('customSite').addEventListener('click', function () {
    let site = {
      'type': 'custom',
      'siteUrl': 'http://' + document.getElementById('siteUrl').value,
      'title': document.getElementById('siteIconTitle').value,
      'color': '#' + document.getElementById('siteIconColor').value
    };
    console.log(site);
    addSite(site);
    clearCustomSiteInfo();
    displaySites();
  })
  document.getElementById('siteIconTitle').addEventListener('change', function () {
    document.getElementById('customSite').innerHTML = document.getElementById('siteIconTitle').value;
  });
  document.getElementById('siteIconColor').addEventListener('change', function () {
    document.getElementById('customSite').style.backgroundColor = '#' + document.getElementById('siteIconColor').value;
  });
}

function addSite(site) {
  let siteList = chrome.storage.sync.get('siteList', (data) => {
    console.log(data);
    if (!data.siteList) {
      chrome.storage.sync.set({ 'siteList': [site] }, displaySites);
    } else {
      let arr = data.siteList;
      arr.push(site);
      chrome.storage.sync.set({ 'siteList': arr }, displaySites);
    }
  })
}

function clearSites() {
  chrome.storage.sync.remove('siteList', displaySites);
}

function clearCustomSiteInfo() {
  document.getElementById('siteIconTitle').value = 'custom';
  document.getElementById('siteIconColor').value = 'bada55';
  document.getElementById('siteUrl').value = '';
  document.getElementById('customSite').style.backgroundColor = '#bada55';
  document.getElementById('customSite').innerHTML = 'custom';
}

function openSitePicker() {
  document.getElementById('sitePicker').style.display = 'block';
}

function closeSitePicker() {
  document.getElementById('sitePicker').style.display = 'none';
}

displaySites();
setupSitePicker();
document.getElementById('newSite').addEventListener('click', openSitePicker);
document.getElementById('clearSites').addEventListener('click', clearSites);
