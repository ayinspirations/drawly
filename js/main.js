const screens = {
  start: '/components/giveaway-start.html',
  preview: '/components/giveaway-preview.html',
  criteria: '/components/giveaway-criteria.html',
  draw: '/components/giveaway-draw.html' // Hier angepasst oder hinzugefügt
};

let currentPostLink = '';

function showScreen(name) {
  loadComponent('screenContainer', screens[name]);
}

async function loadComponent(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fehler beim Laden');
    document.getElementById(id).innerHTML = await res.text();

    if(url.includes('giveaway-preview.html')){
      document.getElementById('previewLink').textContent = currentPostLink;
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.add('active'));
  } catch (err) {
    console.error(`[Drawly Fehler] Komponente '${url}' konnte nicht geladen werden.`, err);
  }
}

function goToPreview() {
  const postLink = document.getElementById('postLink').value;
  if (!postLink) {
    alert('Bitte gib einen gültigen Link ein!');
    return;
  }
  currentPostLink = postLink;
  showScreen('preview');
}

function goToCriteria() {
  showScreen('criteria');
}

function toggleMenu() {
  const nav = document.getElementById('navMenu');
  const isVisible = nav.style.display === 'flex';
  nav.style.display = isVisible ? 'none' : 'flex';
}

window.toggleMenu = toggleMenu; // ← wichtig: Funktion global machen


window.handlePostLink = () => {
  const minTagged = document.getElementById('minTaggedAccounts').value;
  const hashtags = document.getElementById('requiredHashtags').value.split(',').map(h => h.trim()).filter(h => h);
  const postLiked = document.getElementById('postLiked').value === 'true';
  const winnerCount = document.getElementById('winnerCount').value;

  console.log({
    currentPostLink,
    minTagged,
    hashtags,
    postLiked,
    winnerCount
  });

  alert('Kommentare werden geladen und ausgewertet.');
};

window.addEventListener('DOMContentLoaded', () => {
  showScreen('start');
});
