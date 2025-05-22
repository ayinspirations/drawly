// giveaway.js – Neustrukturierung basierend auf klaren MVP-Anforderungen

const comments = Array.from({ length: 150 }, (_, i) => ({
  user: `user${i + 1}`,
  text: `Kommentar ${i + 1}`,
  profilePic: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`
}));

window.handlePostLink = function () {
  const link = document.getElementById('postLink')?.value || '';
  if (!link || !link.includes('http')) {
    alert('Bitte gib einen gültigen Link ein.');
    return;
  }

  window.previewData = {
    link,
    likes: 132,
    comments: comments.length,
    previewImg: 'https://placehold.co/300x600?text=Instagram+Vorschau'
  };

  loadComponent('screenContainer', '/components/giveaway-preview.html').then(() => {
    document.getElementById('previewImage').src = window.previewData.previewImg;
    document.getElementById('commentCount').textContent = window.previewData.comments;
    document.getElementById('likeCount').textContent = window.previewData.likes;
  });
}

window.gotoCriteria = function () {
  loadComponent('screenContainer', '/components/giveaway-criteria.html');
}

window.prepareDraw = function () {
  const likeRequired = document.getElementById('requireLike')?.checked;
  const hashtags = document.getElementById('hashtagInput')?.value || '';

  window.drawCriteria = {
    likeRequired,
    hashtags: hashtags.split(',').map(h => h.trim()).filter(Boolean)
  };

  if (comments.length > 100) {
    alert('Für mehr als 100 Kommentare ist ein Abo erforderlich.');
    showScreen('pricing');
    return;
  }

  startDraw();
}

window.startDraw = function () {
  loadComponent('screenContainer', '/components/giveaway-draw.html').then(() => {
    const winnerCount = 1;
    const shuffled = comments.sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, winnerCount);
    window.lastDrawWinners = winners;
    showWinners(winners);
    launchConfetti();
  });
}

function showWinners(winners) {
  const container = document.getElementById("winnersList");
  container.innerHTML = '';
  winners.forEach((winner) => {
    const div = document.createElement("div");
    div.className = 'winner-final';
    div.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <img src="${winner.profilePic}" alt="${winner.user}" style="width:100px; height:100px; border-radius:50%; border:4px solid white; margin-bottom:10px;" />
        <h3>Herzlichen Glückwunsch, ${winner.user}!</h3>
      </div>
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
  const criteria = window.drawCriteria || {};

  const protocol = `Drawly Ziehungsprotokoll\nDatum: ${timestamp}\nKriterien:\n- Like erforderlich: ${criteria.likeRequired ? 'Ja' : 'Nein'}\n- Hashtags: ${criteria.hashtags?.join(', ') || 'Keine'}\nTeilnehmer: ${comments.length}\nGewinner:\n${winners.map((w, i) => `${i + 1}. ${w.user}`).join('\n')}\nZufalls-ID: DRAWLY-${Date.now()}`;

  const blob = new Blob([protocol], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ziehungsprotokoll.txt';
  link.click();
}  