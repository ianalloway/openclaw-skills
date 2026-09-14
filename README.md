# Ian's OpenClaw Skills

![Skills](https://img.shields.io/badge/skills-16-blue)
![CI](https://github.com/ianalloway/openclaw-skills/actions/workflows/ci.yml/badge.svg)
![OpenClaw](https://img.shields.io/badge/OpenClaw-AI_Agent-purple)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![ClawHub](https://img.shields.io/badge/ClawHub-publishable-orange)

Custom skills for [OpenClaw](https://github.com/openclaw/openclaw) - the open-source AI assistant.

This repo currently includes **16 skills**.

## 📦 Featured Bundles

Curated sets of skills that solve a real problem end-to-end. Install one bundle, get a working system.

### 🎯 [Sports Bettor](./bundles/sports-bettor.md)
**Real-time odds → Kelly-sized bet → journaled P&L. The full loop.**

- `sports-odds` — Live odds from major sportsbooks
- `kelly-criterion` — Mathematically optimal bet sizing
- `bet-journal` — Closing-line value and ROI tracking

### 💰 [Crypto Watcher](./bundles/crypto-watcher.md)
**Track prices, read sentiment, rebalance automatically.**

- `crypto-price` — Real-time prices across exchanges
- `market-sentiment` — Sentiment scoring from news + social
- `portfolio-rebalancer` — Threshold-based rebalancing

### 🛠️ [Developer Power Tools](./bundles/developer-tools.md)
**Ship faster and sleep better.**

- `git-helper` — Smart git workflows (rebase, bisect, cleanup)
- `screenshot-annotator` — Mark up screenshots for bug reports
- `security-scanner` — Dependency CVE checks, secret detection
- `judge-audit` — Audit LLM-as-judge bias with juryrig / HttpJudge

---

## Skills Included

### 1. Sports Betting Odds (`sports-odds`)
Get live betting odds from multiple sportsbooks. Compare lines across DraftKings, FanDuel, BetMGM, and more.

**Features:**
- Live odds for NFL, NBA, MLB, NHL, and soccer
- Compare spreads and moneylines across books
- Find the best available lines
- Track API usage

**Requires:** Free API key from [The Odds API](https://the-odds-api.com/)

### 2. NFT Price Tracker (`nft-tracker`)
Track NFT collection prices, floor prices, and sales data for Ethereum collections.

**Features:**
- Floor prices for BAYC, MAYC, CryptoPunks, Azuki, and more
- Recent sales data
- Volume statistics (24h, 7d, 30d)
- Token-level lookups

**Uses:** [OpenSea API](https://docs.opensea.io/reference/api-overview) (API key required)

### 3. Data Visualization (`data-viz`)
Create charts and graphs directly in the terminal from CSV/JSON data.

**Features:**
- Bar charts, line charts, histograms, scatter plots
- Works with CSV, JSON, or piped data
- Multiple tool options (YouPlot, termgraph, gnuplot)
- Real-world examples for stocks, metrics, and APIs

### 4. Kelly Criterion (`kelly-criterion`)
Calculate mathematically optimal bet sizes to maximize long-term bankroll growth.

**Features:**
- Full and fractional Kelly calculations
- American-to-decimal odds converter
- Multi-bet portfolio Kelly sizing
- Edge and expected value breakdowns

### 5. Portfolio Rebalancer (`portfolio-rebalancer`)
Rebalance a portfolio to target allocations with drift detection and tax-aware buy-only mode.

**Features:**
- Drift detection vs. target allocations
- Buy-only rebalancing (no sells) for tax efficiency
- Multiple asset class support
- Actionable trade recommendations

### 6. Market Sentiment (`market-sentiment`)
Read crowd psychology before entering a trade. Combines Fear & Greed, Reddit mentions, headline tone, and VIX.

**Features:**
- Crypto Fear & Greed Index with visual bar
- Reddit mention counter across finance subs
- Headline sentiment scorer (bullish/bearish keywords)
- VIX regime classifier with position-sizing guidance
- Composite directional score

### 7. Streak Tracker (`streak-tracker`)
Identify hot/cold streaks and regression-to-mean opportunities for sports teams.

**Features:**
- SU and ATS streak analysis
- Regression-to-mean signal detection
- Home/away performance splits
- Back-to-back fatigue filter (NBA/NHL)

### 8. Security Scanner (`security-scanner`)
Scan code and dependencies for known vulnerabilities and common security issues.

**Features:**
- npm audit and pip safety checks
- Common OWASP-style code pattern detection
- JSON output for CI integration

### 9. Devin Integration (`devin-integration`)
Bidirectional workflow integration with Devin AI for async development tasks.

**Features:**
- Session creation and status polling
- Webhook-based result callbacks
- PR generation from completed sessions

### 10. DFS Optimizer (`dfs-optimizer`)
Build optimal Daily Fantasy Sports lineups under salary-cap constraints for DraftKings and FanDuel.

**Features:**
- NBA and NFL lineup builders (greedy value optimizer)
- Stack correlation calculator for NFL GPP tournaments
- Ownership & leverage scoring for contrarian play selection
- Quick-reference roster formats for all major DK/FD contests

### 11. Bet Journal (`bet-journal`)
Track every bet locally, measure your true edge, and find where you're actually making money.

**Features:**
- Initialize a local CSV journal with `~/.openclaw/bet-journal.csv`
- Log bets with one command (auto-calculates P&L)
- Dashboard: record, win rate, ROI, P&L by sport and bet type
- Closing Line Value (CLV) tracker — the #1 long-term edge metric
- Monthly P&L chart with running balance
- Action Network import helper

### 12. Crypto Price (`crypto-price`)
Get real-time cryptocurrency prices, market cap, volume, and portfolio value from CoinGecko.

**Features:**
- Live prices for any coin (single or batch)
- Market cap, 24h volume, ATH, and trending coins
- Simple portfolio value calculator
- ETH gas oracle lookup

**Uses:** [CoinGecko API](https://docs.coingecko.com/) (free, no key required)

### 13. Git Helper (`git-helper`)
Everyday git workflows: branching, rebasing, undoing mistakes, and cleanup.

**Features:**
- Conventional commit examples
- Undo, stash, rebase, and cherry-pick recipes
- Branch and remote management
- Troubleshooting (detached HEAD, reflog recovery)

### 14. Screenshot Annotator (`screenshot-annotator`)
Capture, annotate, and describe screenshots for bug reports and tutorials (macOS).

**Features:**
- Full screen, window, or region capture via Peekaboo
- Auto-annotated UI element IDs
- AI descriptions of on-screen state
- Before/after comparison workflows

**Requires:** macOS + [Peekaboo](https://github.com/openclaw/Peekaboo) (`brew install openclaw/tap/peekaboo`)

### 15. Weather Forecast (`weather-forecast`)
Current conditions, multi-day forecasts, and alerts for any location.

**Features:**
- One-liner and JSON weather via wttr.in (no API key)
- NWS alerts by point or state (US)
- Sunrise/sunset and moon phase
- Optional OpenWeatherMap detailed data

**Uses:** [wttr.in](https://github.com/chubin/wttr.in) (free, no key required)

### 16. Judge Audit (`judge-audit`)
Audit an LLM-as-judge with [juryrig](https://github.com/ianalloway/juryrig) before you trust its scores.

**Features:**
- Position, verbosity, prompt-injection, and self-consistency audits
- Full suite via `juryrig cases.json` CLI (CI-friendly exit codes)
- `HttpJudge` against any OpenAI-compatible endpoint (Ollama, vLLM, LM Studio)
- Threshold tuning and calibration helpers (Brier / ECE)

**Requires:** Python 3.10+ and `pip install juryrig` (local models preferred)

## Installation

### Quick install (recommended)

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills

# Individual skills
./install.sh sports-odds kelly-criterion bet-journal

# Curated bundles
./install.sh --bundle sports-bettor
./install.sh --bundle crypto-watcher
./install.sh --bundle developer-tools
```

One-liner (no clone required for a bundle):

```bash
curl -sL https://raw.githubusercontent.com/ianalloway/openclaw-skills/main/install.sh |   bash -s -- --bundle sports-bettor
```

Skills install to `~/.openclaw/skills/` by default (override with `--dest DIR` or `OPENCLAW_SKILLS_DIR`).

### Manual copy

```bash
cp -r sports-odds ~/.openclaw/skills/
# …or any other skill folder in this repo
```

Or publish to [ClawHub](https://clawhub.ai/) for community access.

## Usage

Once installed, OpenClaw will automatically use these skills when relevant. You can also explicitly request them:

- "Get the current NFL betting odds"
- "What's the floor price for MAYC?"
- "Create a bar chart from this CSV data"
- "What's the optimal Kelly bet for 58% win probability at -130?"
- "Rebalance my portfolio to 60/30/10 BTC/ETH/SOL"
- "What's the current market sentiment for BTC?"
- "Is the Lakers ATS streak due for regression?"
- "Build me an optimal DraftKings NBA lineup for tonight"
- "Log a bet: Warriors -3.5 at -110, $100 stake, win"
- "Show me my bet journal dashboard"
- "What's the Bitcoin price right now?"
- "Help me rebase this branch onto main"
- "Annotate a screenshot of this bug"
- "What's the weather in NYC?"
- "Audit this LLM judge for position bias with juryrig"

## Author

Created by [Ian Alloway](https://github.com/ianalloway) - Data Scientist specializing in AI/ML and sports analytics.

## License

MIT License - Feel free to use, modify, and distribute.
