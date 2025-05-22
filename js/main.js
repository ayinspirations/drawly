// main.js – final mit Sprachumschaltung, Navigation und Logik

const screens = {
  start: '/components/giveaway-start.html',
  preview: '/components/giveaway-preview.html',
  criteria: '/components/giveaway-criteria.html',
  draw: '/components/giveaway-draw.html'
};

const modals = {
  loginModal: '/components/login-modal.html',
  premiumModal: '/components/premium-modal.html'
};

let currentLang = 'en';
let translations = {};
let currentPostLink = '';
let winnerCount = 1;
let minTaggedAccounts = 0;
let requiredHashtags = [];
let postLiked = false;

function showScreen(name) {
  const url = screens[name];
  if (!url) return;
  loadComponent('screenContainer', url);
  closeMenu();
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
    document.getElementById(id).innerHTML = await res.text();
    updateTexts();
  } catch (err) {
    console.error(`[Drawly Fehler] Komponente '${url}' konnte nicht geladen werden.`, err);
  }
}

function toggleMenu() {
  const nav = document.getElementById('navMenu');
  const burger = document.getElementById('burger');
  const isOpen = nav.style.display === 'flex';
  nav.style.display = isOpen ? 'none' : 'flex';
  burger.classList.toggle('open', !isOpen);
}

function closeMenu() {
  const nav = document.getElementById('navMenu');
  const burger = document.getElementById('burger');
  if (nav && burger) {
    nav.style.display = 'none';
    burger.classList.remove('open');
  }
}

window.toggleMenu = toggleMenu;

function goToPreview() {
  const postLinkInput = document.getElementById('postLink');
  if (!postLinkInput || !postLinkInput.value) return alert("Bitte Link eingeben");
  currentPostLink = postLinkInput.value;
  showScreen('preview');
}

function goToCriteria() {
  showScreen('criteria');
}

window.handlePostLink = () => {
  minTaggedAccounts = parseInt(document.getElementById('minTaggedAccounts').value);
  requiredHashtags = document.getElementById('requiredHashtags').value.split(',').map(h => h.trim()).filter(Boolean);
  postLiked = document.getElementById('postLiked').value === 'true';
  winnerCount = parseInt(document.getElementById('winnerCount').value);

  console.log({
    currentPostLink,
    minTaggedAccounts,
    requiredHashtags,
    postLiked,
    winnerCount
  });

  showScreen('draw');
};

async function setLanguage(langCode) {
  try {
    currentLang = langCode;
    localStorage.setItem('drawly-lang', langCode);

    const pathPrefix = window.location.pathname.includes('/drawly') ? '/drawly' : '';
    const res = await fetch(`${pathPrefix}/lang/${langCode}.json`);
    if (!res.ok) throw new Error('Language file not found');

    translations = await res.json();
    updateTexts();
  } catch (err) {
    console.error("Sprache konnte nicht geladen werden:", err);
  }
}

function updateTexts() {
  for (const key in translations) {
    const el = document.getElementById(key);
    if (el) el.textContent = translations[key];
  }
}

async function detectUserLanguage() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const countryCode = data.country;
    const map = { DE: 'de', US: 'en', GB: 'en', ES: 'es', CN: 'zh', RU: 'ru', TR: 'tr' };
    const lang = map[countryCode] || 'en';
    setLanguage(lang);
  } catch {
    setLanguage('en');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('drawly-lang');
  if (saved) {
    setLanguage(saved);
  } else {
    detectUserLanguage();
  }
  showScreen('start');
});