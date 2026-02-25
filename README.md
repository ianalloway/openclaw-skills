# Ian's OpenClaw Skills

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![OpenClaw](https://img.shields.io/badge/OpenClaw-AI_Agent-purple)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Custom skills for [OpenClaw](https://github.com/openclaw/openclaw) - the open-source AI assistant.

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

**Uses:** [Reservoir API](https://reservoir.tools/) (free, no key required)

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

## Installation

Copy any skill folder to your OpenClaw skills directory:

```bash
cp -r sports-odds ~/.openclaw/skills/
cp -r nft-tracker ~/.openclaw/skills/
cp -r data-viz ~/.openclaw/skills/
cp -r kelly-criterion ~/.openclaw/skills/
cp -r portfolio-rebalancer ~/.openclaw/skills/
cp -r market-sentiment ~/.openclaw/skills/
cp -r streak-tracker ~/.openclaw/skills/
cp -r dfs-optimizer ~/.openclaw/skills/
cp -r bet-journal ~/.openclaw/skills/
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

## Author

Created by [Ian Alloway](https://github.com/ianalloway) - Data Scientist specializing in AI/ML and sports analytics.

## License

MIT License - Feel free to use, modify, and distribute.
