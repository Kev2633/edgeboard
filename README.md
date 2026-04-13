# EdgeBoard

Sports betting dashboard - compare lines across sportsbooks, track promotions, and monitor deposits.

## Quickest Start (One File)

**Just open `app.html` in your browser.** That's it. No server, no install, no dependencies.

- All CSS, JS, and HTML in a single file
- Data persists in localStorage (survives refresh)
- Works offline
- 6 tabs: Dashboard, Line Comparison, Promotions, Accounts, Transactions, CSV Import

## Features

- **Dashboard** - Total deposited, withdrawn, net bankroll, deposits chart, recent transactions
- **Line Comparison** - FanDuel, DraftKings, BetMGM, Caesars side-by-side with best line highlighted in green
- **Promotions Tracker** - Filter active promos by sport and sportsbook
- **Account Management** - Track deposits, withdrawals, bonuses, and net P/L per sportsbook
- **Transactions** - Add/delete individual transactions with inline form
- **CSV Import** - Upload transaction history with preview before confirming
- **localStorage** - All data saved locally, persists across sessions
- **API Ready** - Auto-connects to FastAPI backend when running

## Project Structure

```
edgeboard/
  app.html          # Combined single-file app (START HERE)
  frontend/          # Multi-file version
    index.html
    styles.css
    app.js
    api.js
  backend/           # FastAPI Python API
    main.py
    requirements.txt
  sample_data/
    transactions.csv  # Sample CSV for testing import
```

## Backend API (Optional)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### Live Odds
Get a free API key from https://the-odds-api.com:
```bash
export ODDS_API_KEY=your_key_here
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Summary stats |
| GET | /api/accounts | List accounts with totals |
| POST | /api/accounts | Add sportsbook account |
| GET | /api/transactions | List all transactions |
| POST | /api/transactions | Add transaction |
| POST | /api/transactions/import-csv | Upload CSV |
| GET | /api/promotions | List promos |
| GET | /api/odds/{sport} | Live odds |

## CSV Format

```csv
date,sportsbook,type,amount
2026-01-15,fanduel,deposit,500.00
2026-01-20,draftkings,deposit,250.00
2026-02-01,fanduel,withdrawal,200.00
```

## Roadmap

- [ ] PostgreSQL database
- [ ] User authentication
- [ ] Real-time odds auto-refresh
- [ ] Bet slip tracking
- [ ] Arbitrage calculator
- [ ] Email alerts for line movement
- [ ] Mobile PWA support
