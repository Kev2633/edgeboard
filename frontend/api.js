// EdgeBoard API Client
// Connects frontend to FastAPI backend when running

const API_BASE = 'http://localhost:8000';
let useAPI = false;

// Check if backend is available
async function checkBackend() {
  try {
    const resp = await fetch(API_BASE + '/api/dashboard', { signal: AbortSignal.timeout(2000) });
    if (resp.ok) { useAPI = true; console.log('Backend connected'); await syncFromAPI(); }
  } catch (e) {
    useAPI = false;
    console.log('Backend not available - using local mode');
  }
}

// Sync state from API
async function syncFromAPI() {
  if (!useAPI) return;
  try {
    const [accounts, transactions, promotions] = await Promise.all([
      fetch(API_BASE + '/api/accounts').then(r => r.json()),
      fetch(API_BASE + '/api/transactions').then(r => r.json()),
      fetch(API_BASE + '/api/promotions').then(r => r.json())
    ]);
    state.accounts = accounts.map(a => ({ sportsbook: a.sportsbook, nickname: a.nickname }));
    state.transactions = transactions;
    if (promotions.length > 0) state.promotions = promotions;
    renderAll();
  } catch (e) { console.error('Sync failed:', e); }
}

// Push account to API
async function apiAddAccount(acct) {
  if (!useAPI) return;
  await fetch(API_BASE + '/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(acct)
  });
}

// Push transaction to API
async function apiAddTransaction(txn) {
  if (!useAPI) return;
  await fetch(API_BASE + '/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txn)
  });
}

// Upload CSV to API
async function apiImportCSV(file) {
  if (!useAPI) return null;
  const formData = new FormData();
  formData.append('file', file);
  const resp = await fetch(API_BASE + '/api/transactions/import-csv', {
    method: 'POST',
    body: formData
  });
  return resp.json();
}

// Fetch live odds from API
async function apiFetchOdds(sport) {
  if (!useAPI) return null;
  try {
    const resp = await fetch(API_BASE + '/api/odds/' + sport);
    const data = await resp.json();
    if (data.error) { console.warn('Odds API:', data.error); return null; }
    return data;
  } catch (e) { console.error('Odds fetch failed:', e); return null; }
}

// Parse odds API response into our line format
function parseOddsResponse(events) {
  const lines = [];
  if (!events || !Array.isArray(events)) return lines;
  events.forEach(event => {
    const home = event.home_team;
    const away = event.away_team;
    const eventName = away + ' vs ' + home;
    const bookOdds = {};
    (event.bookmakers || []).forEach(bm => {
      const key = bm.key;
      (bm.markets || []).forEach(market => {
        market.outcomes.forEach(outcome => {
          if (!bookOdds[market.key]) bookOdds[market.key] = {};
          if (!bookOdds[market.key][key]) bookOdds[market.key][key] = {};
          const price = outcome.price > 0 ? '+' + outcome.price : '' + outcome.price;
          const point = outcome.point !== undefined ? outcome.point + ' ' : '';
          bookOdds[market.key][key][outcome.name] = point + price;
        });
      });
    });
    Object.entries(bookOdds).forEach(([marketKey, books]) => {
      const fd = books.fanduel || {};
      const dk = books.draftkings || {};
      const mgm = books.betmgm || {};
      const cs = books.williamhill_us || {};
      const homeVals = [fd[home], dk[home], mgm[home], cs[home]].filter(Boolean);
      if (homeVals.length > 0) {
        lines.push({
          event: eventName,
          sport: event.sport_key,
          market: marketKey === 'h2h' ? 'moneyline' : marketKey === 'spreads' ? 'spread' : 'total',
          fanduel: fd[home] || '-',
          draftkings: dk[home] || '-',
          betmgm: mgm[home] || '-',
          caesars: cs[home] || '-',
          best: 'See table'
        });
      }
    });
  });
  return lines;
}

// Init: check backend on load
checkBackend();
