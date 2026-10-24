# Crypto Watcher Bundle

Track prices, read market sentiment, and rebalance to target allocations.

## Skills in this bundle

- **[crypto-price](../crypto-price)** — Real-time prices, market cap, volume, and portfolio value (CoinGecko)
- **[market-sentiment](../market-sentiment)** — Fear & Greed, Reddit mentions, headline tone, VIX regime
- **[portfolio-rebalancer](../portfolio-rebalancer)** — Drift detection and tax-aware rebalancing trades

## Why these three together

Crypto portfolios fail for predictable reasons:

1. **Stale prices** — You rebalance off a gut feel instead of live data. `crypto-price` pulls current quotes without an API key.
2. **Ignoring crowd risk** — You size risk the same in euphoria and panic. `market-sentiment` gives a quick directional bias before you trade.
3. **Allocation drift** — Winners balloon and losers shrink until you're overexposed. `portfolio-rebalancer` turns targets into concrete buy/sell amounts.

Install all three and you can check prices, read the room, and compute the rebalance in one loop.

## Install

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
./install.sh --bundle crypto-watcher
```

Run from the checkout so the installer can copy every skill folder. The default
destination is `~/.openclaw/skills/`; use `--dest DIR` to choose another directory
outside the checkout. Existing selected skill folders are replaced.

## Example requests

These skills guide OpenClaw; installation does not add standalone shell
commands. Try these requests:

- “Get current Bitcoin, Ethereum, and Solana prices with the source and timestamp.”
- “Summarize Bitcoin market sentiment and show the inputs behind the score.”
- “Using my supplied holdings, calculate trades to reach 60% BTC, 30% ETH, and 10% SOL.”
- “Show a buy-only alternative to those rebalancing suggestions.”

Rebalancing output is a proposed allocation plan. Review prices, fees, and the
holdings used before acting on it.

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
