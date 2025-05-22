// giveaway.js – Logik für die Gewinnspiel-Auslosung

const comments = Array.from({ length: 150 }, (_, i) => ({
  user: `user${i + 1}`,
  text: `Kommentar ${i + 1}`,
  profilePic: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`
}));

function handlePostLink() {
  const link = document.getElementById('postLink')?.value || '';
  let platform = 'Unbekannt';
  if (link.includes('instagram.com')) platform = 'Instagram';
  else if (link.includes('facebook.com')) platform = 'Facebook';
  else if (link.includes('youtube.com')) platform = 'YouTube';
  else if (link.includes('tiktok.com')) platform = 'TikTok';

  localStorage.setItem('platform', platform);
  localStorage.setItem('link', link);

  loadComponent('screenContainer', '/components/giveaway-preview.html')
    .then(() => {
      document.getElementById('platformText').textContent = platform;
      document.getElementById('platformIcon').src = {
        Instagram: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
        Facebook: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
        YouTube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        TikTok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
        Unbekannt: 'https://cdn-icons-png.flaticon.com/512/565/565547.png'
      }[platform];
    });
}

function startDraw() {
  loadComponent('screenContainer', '/components/giveaway-draw.html')
    .then(() => {
      const winnerCount = parseInt(document.getElementById('winnerCount')?.value) || 1;
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

          const shuffled = [...comments].sort(() => 0.5 - Math.random());
          const winners = shuffled.slice(0, winnerCount);
          window.lastDrawWinners = winners;
          showWinners(winners);
          launchConfetti();

          document.getElementById('exportArea').style.display = 'block';
          document.getElementById('protocolArea').style.display = 'block';
          document.getElementById('screenshotBox').style.display = 'block';
        }
      }, 1000);
    });
}

function showWinners(winners) {
  const container = document.getElementById('winnersList');
  container.innerHTML = '';

  winners.forEach((winner, index) => {
    const div = document.createElement('div');
    div.style = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      width: 100px;
      height: ${100 + (3 - index) * 20}px;
      background: #e8dcd1;
      border-radius: 10px 10px 0 0;
      margin: 0 5px;
      padding: 10px;
      transition: all 0.6s ease;
      opacity: 0;
      transform: translateY(20px);
    `;

    const img = document.createElement('img');
    img.src = winner.profilePic;
    img.alt = winner.user;
    img.style = 'width: 60px; height: 60px; border-radius: 50%; border: 3px solid #c8a989; margin-bottom: 10px;';

    const name = document.createElement('div');
    name.textContent = winner.user;
    name.style.fontWeight = 'bold';

    const place = document.createElement('div');
    place.textContent = `${index + 1}. Platz`;
    place.style = 'font-size: 0.9rem; color: #5b3e31;';

    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(place);
    container.appendChild(div);

    setTimeout(() => {
      div.style.opacity = 1;
      div.style.transform = 'translateY(0)';
    }, 500 * index);
  });
}

function launchConfetti() {
  const emojis = ['🎉', '✨', '🎊', '💫', '🌟'];
  for (let i = 0; i < 50; i++) {
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style = `
      position: fixed;
      top: -50px;
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 2 + 1}rem;
      z-index: 9999;
      animation: fall ${2 + Math.random() * 2}s linear forwards;
    `;
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 4000);
  }
}

function takeScreenshot() {
  html2canvas(document.getElementById('screenContainer')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'gewinner.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function exportCommentsToCSV() {
  const rows = [['Benutzer', 'Kommentar']];
  comments.forEach(c => rows.push([c.user, c.text]));
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
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
  const platform = localStorage.getItem('platform') || 'Unbekannt';
  const criteria = [];

  const hashtag = document.getElementById('hashtagInput')?.value;
  if (hashtag) criteria.push(`Hashtag: ${hashtag}`);
  const mentions = document.getElementById('mentionCount')?.value;
  if (mentions) criteria.push(`Markierungen: mind. ${mentions}`);
  const follows = [follow1?.value, follow2?.value, follow3?.value].filter(f => f);
  if (follows.length) criteria.push(`Follows: ${follows.join(', ')}`);
  if (document.getElementById('requireLike')?.checked) criteria.push('Like erforderlich');

  const protocol = `Drawly Ziehungsprotokoll\nDatum: ${timestamp}\nPlattform: ${platform}\nKriterien:\n- ${criteria.join('\n- ')}\nTeilnehmer: ${comments.length}\nGewinner:\n${winners.map((w, i) => `${i + 1}. ${w.user}`).join('\n')}\nZufalls-ID: DRAWLY-${Date.now()}`;

  const blob = new Blob([protocol], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ziehungsprotokoll.txt';
  link.click();
}