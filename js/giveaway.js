<!-- giveaway-start.html -->
<div class="screen active" style="max-width:500px;margin:auto;text-align:center;background:#fffaf6;border-radius:24px;padding:2rem;box-shadow:0 6px 20px rgba(0,0,0,0.1);">

  <h2 style="font-family:'Playfair Display',serif;color:#5b3e31;margin-bottom:1rem;">Gewinnspiel starten 🎉</h2>

  <input type="text" id="postLink" placeholder="Link zum Instagram-Post eingeben" style="padding:0.75rem 1rem;border-radius:20px;border:1px solid #ccc;width:100%;margin:1rem 0;">

  <div class="criteria-card" style="margin-top:1.5rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem;">

    <label style="font-weight:bold;color:#5b3e31;">Min. Anzahl markierter Accounts</label>
    <select id="minTaggedAccounts" style="padding:0.75rem;width:80%;border-radius:20px;border:1px solid #ccc;">
      <option value="0">Keine Vorgabe</option>
      <option value="1">Mindestens 1</option>
      <option value="2">Mindestens 2</option>
      <option value="3">Mindestens 3</option>
      <option value="4">Mindestens 4</option>
      <option value="5">Mindestens 5</option>
    </select>

    <label style="font-weight:bold;color:#5b3e31;margin-top:1rem;">Anzahl Gewinner festlegen</label>
    <select id="winnerCount" style="padding:0.75rem;width:80%;border-radius:20px;border:1px solid #ccc;">
      <option value="1">1 Gewinner</option>
      <option value="2">2 Gewinner</option>
      <option value="3">3 Gewinner</option>
      <option value="4">4 Gewinner</option>
      <option value="5">5 Gewinner</option>
      <option value="6">6 Gewinner</option>
      <option value="7">7 Gewinner</option>
      <option value="8">8 Gewinner</option>
      <option value="9">9 Gewinner</option>
      <option value="10">10 Gewinner</option>
    </select>

  </div>

  <button onclick="handlePostLink()" style="background:#c8a989;color:white;padding:0.75rem 2rem;margin-top:1.5rem;border:none;border-radius:30px;font-weight:bold;cursor:pointer;">
    Kommentare laden
  </button>

</div>

<script>
  function handlePostLink() {
    const postLink = document.getElementById('postLink').value;
    const minTagged = parseInt(document.getElementById('minTaggedAccounts').value);
    const winnerCount = parseInt(document.getElementById('winnerCount').value);

    if (!postLink) {
      alert('Bitte gib einen gültigen Link ein!');
      return;
    }

    console.log("Post URL:", postLink);
    console.log("Min. markierte Accounts:", minTagged);
    console.log("Anzahl der Gewinner:", winnerCount);

    // Hier folgt später deine Logik:
    // 1. Kommentare laden
    // 2. Prüfen, wie viele Accounts in jedem Kommentar markiert wurden (@username)
    // 3. Kommentare filtern
    // 4. Gewinner ermitteln

    alert('Kommentare werden geladen und überprüft...');
  }
</script>
