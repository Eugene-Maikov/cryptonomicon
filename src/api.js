const API_KEY =
    "55e56755aa0c1e5cde441ba9d201d24896c2a99f66e9a081040c95fea910ca83"

const tickers = new Map()

export const loadTickers = tickers =>
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
            ","
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData =>
            Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )
        )

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || []
    tickers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || []
    tickers.set(
        ticker,
        subscribers.filter(fn => fn !== cb)
    )
}
