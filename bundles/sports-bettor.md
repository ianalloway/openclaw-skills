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

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
./install.sh --bundle sports-bettor
```

Run from the checkout so the installer can copy every skill folder. The default
destination is `~/.openclaw/skills/`; use `--dest DIR` to choose another directory
outside the checkout. Existing selected skill folders are replaced.

Live odds require a [The Odds API](https://the-odds-api.com/) key.

## Example requests

These skills guide OpenClaw; installation does not add shell commands named
`sports-odds` or `bet-journal`. Ask the assistant to run the documented workflow:

| Step | Request |
|------|---------|
| Compare prices | “Get current Lakers–Warriors odds and show the best price by sportsbook.” |
| Size a position | “Calculate quarter-Kelly for a 58% win estimate at -110 with a $1,000 bankroll.” |
| Record the ticket | “Log a $29.50 Lakers moneyline bet at -110 with my 58% estimate.” |
| Track the close | “Record the closing odds for that same moneyline ticket and calculate CLV.” |
| Review results | “Show my settled-bet P&L and beat-close rate by sportsbook.” |

The sizing example is $29.50 at quarter-Kelly (11.8% full Kelly). It depends on
the supplied 58% probability estimate; the skill does not verify that estimate.
Compare entry and closing prices for the same market and selection.

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
