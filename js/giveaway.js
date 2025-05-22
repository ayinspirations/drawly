// giveaway.js

const comments = Array.from({ length: 150 }, (_, i) => ({
  user: `user${i + 1}`,
  text: `Kommentar ${i + 1}`,
  profilePic: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`
}));

window.handlePostLink = function () {
  const link = document.getElementById('postLink')?.value || '';
  let platform = '';
  if (link.includes('instagram.com')) platform = 'Instagram';
  else if (link.includes('facebook.com')) platform = 'Facebook';
  else if (link.includes('youtube.com')) platform = 'YouTube';
  else if (link.includes('tiktok.com')) platform = 'TikTok';
  else platform = 'Unbekannt';

  const iconMap = {
    'Instagram': 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    'Facebook': 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
    'YouTube': 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    'TikTok': 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
    'Unbekannt': 'https://cdn-icons-png.flaticon.com/512/565/565547.png'
  };

  window.platformData = {
    name: platform,
    icon: iconMap[platform],
    link
  };

  loadComponent('screenContainer', '/components/giveaway-preview.html').then(() => {
    setTimeout(() => {
      const icon = document.getElementById('platformIcon');
      const text = document.getElementById('platformText');
      if (icon && text && window.platformData) {
        icon.src = window.platformData.icon;
        text.textContent = window.platformData.name;
      }
    }, 50);
  }).catch(err => {
    console.error('[Drawly Fehler] Vorschau konnte nicht geladen werden:', err);
    alert('Ups, etwas ist schief gelaufen. Bitte lade die Seite neu oder kontaktiere den Support.');
  });
}

window.prepareDraw = function () {
  const winnerInput = document.getElementById('winnerCount');
  const winnerCount = parseInt(winnerInput?.value) || 1;
  localStorage.setItem('winnerCount', winnerCount);
  startDraw();
}

window.startDraw = function () {
  if (comments.length > 100) {
    alert('Für mehr als 100 Kommentare ist ein kostenpflichtiger Plan erforderlich.');
    showScreen('pricing');
    return;
  }

  loadComponent('screenContainer', '/components/giveaway-draw.html').then(() => {
    const winnerCount = parseInt(localStorage.getItem('winnerCount')) || 1;
    const countdownBox = document.getElementById('countdownBox');
    let count = 3;
    countdownBox.textContent = count;

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownBox.textContent = count;
      } else {
        clearInterval(countdownInterval);
        countdownBox.textContent = '';
        const shuffled = comments.sort(() => 0.5 - Math.random());
        const winners = shuffled.slice(0, winnerCount);
        window.lastDrawWinners = winners;
        showWinners(winners);
        launchConfetti();
        document.getElementById('exportArea').style.display = 'block';
        document.getElementById('protocolArea').style.display = 'block';
        document.getElementById('screenshotBox').style.display = 'block';
      }
    }, 1000);
  }).catch(err => {
    console.error('[Drawly Fehler] Auslosung konnte nicht geladen werden:', err);
    alert('Ups, etwas ist schief gelaufen. Bitte lade die Seite neu oder kontaktiere den Support.');
  });
}

function showWinners(winners) {
  const container = document.getElementById("winnersList");
  container.innerHTML = '';
  winners.forEach((winner, index) => {
    const div = document.createElement("div");
    div.className = 'winner-card';
    div.innerHTML = `
      <img src="${winner.profilePic}" alt="${winner.user}" style="width:60px; height:60px; border-radius:50%; border:3px solid #c8a989; margin-bottom:10px;" />
      <div style="font-weight:bold;">${winner.user}</div>
      <div style="font-size:0.9rem; color:#5b3e31;">${index + 1}. Platz</div>
    `;
    container.appendChild(div);
  });
}

function launchConfetti() {
  const emojis = ['🎉', '✨', '🎊', '💫', '🌟'];
  for (let i = 0; i < 50; i++) {
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.position = 'fixed';
    emoji.style.top = '-50px';
    emoji.style.left = `${Math.random() * 100}%`;
    emoji.style.fontSize = `${Math.random() * 2 + 1}rem`;
    emoji.style.zIndex = 9999;
    emoji.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 4000);
  }
}

function takeScreenshot() {
  html2canvas(document.querySelector('#screenContainer')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'gewinner.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function exportCommentsToCSV() {
  const rows = [['Benutzer', 'Kommentar']];
  comments.forEach(c => rows.push([c.user, c.text]));
  let csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'teilnehmerliste.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadDrawProtocol() {
  const winners = window.lastDrawWinners || [];
  const timestamp = new Date().toLocaleString();
  const platform = window.platformData?.name || 'Unbekannt';
  const criteria = [];
  const hashtag = document.getElementById('hashtagInput')?.value;
  if (hashtag) criteria.push(`Hashtag: ${hashtag}`);
  const mentions = document.getElementById('mentionCount')?.value;
  if (mentions) criteria.push(`Markierungen: mind. ${mentions}`);
  if (document.getElementById('requireLike')?.checked) criteria.push('Like erforderlich');

  const protocol = `Drawly Ziehungsprotokoll\nDatum: ${timestamp}\nPlattform: ${platform}\nKriterien:\n- ${criteria.join('\n- ')}\nTeilnehmer: ${comments.length}\nGewinner:\n${winners.map((w, i) => `${i + 1}. ${w.user}`).join('\n')}\nZufalls-ID: DRAWLY-${Date.now()}`;

  const blob = new Blob([protocol], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ziehungsprotokoll.txt';
  link.click();
}
