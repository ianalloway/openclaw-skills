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

### Option A: install.sh

```bash
git clone https://github.com/ianalloway/openclaw-skills
cd openclaw-skills
./install.sh --bundle crypto-watcher
```

### Option B: Direct curl-pipe

```bash
curl -sL https://raw.githubusercontent.com/ianalloway/openclaw-skills/main/install.sh | \
  bash -s -- --bundle crypto-watcher
```

### Option C: Manual copy

```bash
cp -r crypto-price market-sentiment portfolio-rebalancer ~/.openclaw/skills/
```

## Example usage

```bash
# Live prices
$ crypto-price bitcoin ethereum solana
BTC $97,450 (+2.1%) · ETH $3,620 (+1.4%) · SOL $178 (-0.6%)

# Sentiment check before sizing
$ market-sentiment btc
Fear & Greed: 72 (Greed) · Reddit mentions elevated · Composite: mildly bullish

# Rebalance to targets
$ portfolio-rebalancer --targets btc=60,eth=30,sol=10 --holdings btc=1.2,eth=8,sol=40
Drift: BTC +4.2% · ETH -2.1% · SOL -2.1%
Suggested: sell 0.05 BTC · buy 0.4 ETH · buy 3 SOL
```

## Author

Ian Alloway — [ianalloway.xyz](https://ianalloway.xyz) · [@ianallowayxyz](https://twitter.com/ianallowayxyz)
