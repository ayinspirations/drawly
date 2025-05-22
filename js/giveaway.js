// giveaway.js

async function handlePostLink() {
  const postLink = document.getElementById('postLink').value;
  const minTagged = parseInt(document.getElementById('minTaggedAccounts').value);
  const winnerCount = parseInt(document.getElementById('winnerCount').value);

  if (!postLink) {
    alert('Bitte gib einen gültigen Instagram-Link ein!');
    return;
  }

  console.log("📌 Post URL:", postLink);
  console.log("👥 Min. markierte Accounts:", minTagged);
  console.log("🏆 Anzahl der Gewinner:", winnerCount);

  try {
    const comments = await fetchComments(postLink);
    const filteredComments = filterComments(comments, minTagged);

    if (filteredComments.length === 0) {
      alert('Keine Kommentare gefunden, die die Kriterien erfüllen.');
      return;
    }

    const winners = selectWinners(filteredComments, winnerCount);
    console.log("🥳 Gewinner:", winners);
    alert(`Gewinner ermittelt: ${winners.map(c => c.username).join(', ')}`);

  } catch (error) {
    console.error('Fehler beim Laden oder Auswerten der Kommentare:', error);
    alert('Ein Fehler ist aufgetreten. Bitte prüfe die URL oder versuche es später erneut.');
  }
}

// Dummy-Funktion: Kommentare abrufen (später mit API-Anbindung ersetzen)
async function fetchComments(postLink) {
  console.log('Kommentare werden geladen für:', postLink);

  // Simulierte Kommentar-Daten
  return [
    { username: 'user1', text: 'Tolles Gewinnspiel @freund1 @freund2' },
    { username: 'user2', text: 'Cool!' },
    { username: 'user3', text: '@freund1 Schau mal hier!' },
    { username: 'user4', text: '@freund1 @freund2 @freund3 Gewinnspielzeit!' },
  ];
}

// Filterfunktion basierend auf markierten Accounts
function filterComments(comments, minTagged) {
  if (minTagged === 0) return comments;

  return comments.filter(comment => {
    const taggedCount = (comment.text.match(/@\w+/g) || []).length;
    return taggedCount >= minTagged;
  });
}

// Gewinner zufällig auswählen
function selectWinners(comments, count) {
  const shuffled = comments.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Globale Bereitstellung
window.handlePostLink = handlePostLink;
