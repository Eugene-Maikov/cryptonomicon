const API_KEY =
    "55e56755aa0c1e5cde441ba9d201d24896c2a99f66e9a081040c95fea910ca83"

const tickersHandlers = new Map()

const loadtickersHandlers = () => {
    if (tickersHandlers.size === 0) {
        return
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
            ...tickersHandlers
                .keys()
        ].join(
            ","
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? []
                handlers.forEach(fn => fn(newPrice))
            })
        })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(
        ticker,
        subscribers.filter(fn => fn !== cb)
    )
}

setInterval(loadtickersHandlers, 5000)