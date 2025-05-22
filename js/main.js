// main.js – Steuert Screens & Fehlerbehandlung

const screens = {
  start: '/components/giveaway-start.html',
  dashboard: '/components/dashboard.html',
  pricing: '/components/pricing.html',
  impressum: '/components/impressum.html'
};

const modals = {
  loginModal: '/components/login-modal.html',
  premiumModal: '/components/premium-modal.html'
};

function showScreen(name) {
  const url = screens[name];
  if (!url) return;
  loadComponent('screenContainer', url);
}

function openLoginModal() {
  loadComponent('loginModal', modals.loginModal);
}

function openPremiumModal() {
  loadComponent('premiumModal', modals.premiumModal);
}

async function loadComponent(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fehler beim Laden');
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(`[Drawly Fehler] Komponente '${url}' konnte nicht geladen werden.`, err);
    document.getElementById(id).innerHTML = `
      <div style="padding:2rem; color:#5b3e31; text-align:center;">
        <h2>Ups, etwas ist schiefgelaufen 🧸</h2>
        <p>Bitte lade die Seite neu. Falls das Problem bleibt, kontaktiere den Support.</p>
      </div>`;
  }
}

function toggleMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('navMenu');
  burger.classList.toggle('open');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Initialer Ladevorgang
window.addEventListener('DOMContentLoaded', () => {
  showScreen('start');
window.loadComponent = loadComponent;

});