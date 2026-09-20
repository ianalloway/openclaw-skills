# Sports Bettor Bundle

The full sports betting loop: real-time odds, Kelly-sized bets, outcome journaling, and dedicated CLV tracking.

## Skills in this bundle

- **[sports-odds](../sports-odds)** — Live odds from major sportsbooks (Moneyline, spread, total)
- **[kelly-criterion](../kelly-criterion)** — Mathematically optimal bet sizing for long-term bankroll growth
- **[bet-journal](../bet-journal)** — Track every bet with stake, result, ROI, and P&L
- **[clv-journal](../clv-journal)** — Entry vs. close CLV pts and beat-close rate rollups

## Why these four together

The sports betting loop has four failure points:

1. **No edge detection** — You place a bet without knowing if the line offers real value. `sports-odds` gives you a current price, but it doesn't tell you if it's worth taking.
2. **Bad sizing** — You bet too much on a hot tip, go on tilt, blow the bankroll. `kelly-criterion` tells you the mathematically optimal bet size for your edge and odds.
3. **No outcome loop** — You forget what you bet and what you made. `bet-journal` records stake, result, and ROI so you know where money is actually won or lost.
4. **No process metric** — Win rate lies in small samples. `clv-journal` logs entry vs. closing odds and rolls up beat-close rate — the gold-standard signal that your process has an edge.

Install all four and you have a system that:
- Reads the live line
- Sizes the bet based on edge and bankroll
- Journals the outcome and P&L
- Scores whether you beat the close

## Install

### Option A: ClawHub (recommended)

```bash
clawhub install bundle/sports-bettor
```

Or via the ClawHub config:

```yaml
# ~/.config/clawhub/bundles.yaml
bundles:
  sports-bettor:
    - sports-odds
    - kelly-criterion
    - bet-journal
    - clv-journal
```

### Option B: Manual

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
clawhub install ./sports-odds ./kelly-criterion ./bet-journal ./clv-journal
```

### Option C: Direct curl-pipe

```bash
curl -sL https://raw.githubusercontent.com/ianalloway/openclaw-skills/main/install.sh | \
  bash -s -- --bundle sports-bettor
```

## Example usage

```bash
# Get live odds for tonight's Lakers game
$ sports-odds lakers warriors
LAL vs GSW · Tonight 7:30pm PT
  Moneyline: LAL +145 / GSW -165
  Spread: LAL +3.5 (-110) / GSW -3.5 (-110)
  Total: 224.5 (-110/-110)

# Calculate Kelly size
$ kelly-criterion --edge 0.58 --odds 145 --bankroll 1000
Edge: 58.0% | American odds: +145
Kelly fraction: 6.2% (full)
Recommendation: 0.25 Kelly = $15.50 (1.55% of bankroll)
Rationale: Edge is real but modest, fractional Kelly reduces variance

# Log the outcome ticket
$ bet-journal add --game "LAL vs GSW" --bet "LAL +3.5" --odds -110 --stake 15.50 --model-prob 0.58
Bet #247 logged · 0.43% of bankroll

# Log CLV entry (fill close at tip-off)
$ clv-journal entry --event "LAL vs GSW" --side "LAL +3.5" --odds -110 --book FanDuel
Logged entry a1b2c3d4 · fill close later

# After close
$ clv-journal close a1b2c3d4 --odds -125 --line 2.5
CLV +2.17 prob pts · Beat close: Y
```

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
