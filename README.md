# Ian's OpenClaw Skills

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

## Installation

Copy the skill folder to your OpenClaw skills directory:

```bash
cp -r sports-odds ~/.openclaw/skills/
cp -r nft-tracker ~/.openclaw/skills/
cp -r data-viz ~/.openclaw/skills/
```

Or publish to [ClawHub](https://clawhub.ai/) for community access.

## Usage

Once installed, OpenClaw will automatically use these skills when relevant. You can also explicitly request them:

- "Get the current NFL betting odds"
- "What's the floor price for MAYC?"
- "Create a bar chart from this CSV data"

## Author

Created by [Ian Alloway](https://github.com/ianalloway) - Data Scientist specializing in AI/ML and sports analytics.

## License

MIT License - Feel free to use, modify, and distribute.
