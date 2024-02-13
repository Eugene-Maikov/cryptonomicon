const API_KEY =
    "55e56755aa0c1e5cde441ba9d201d24896c2a99f66e9a081040c95fea910ca83"

const tickersHandlers = new Map()
const socket = new WebSocket(
    `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
)

const AGGREGATE_INDEX = '5'

socket.addEventListener("message", e => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data)
    if (type !== AGGREGATE_INDEX) {
        return
    }

    const handlers = tickersHandlers.get(currency) ?? []
    handlers.forEach(fn => fn(newPrice))
})

function subscriberToTickerOnWs(ticker) {
    const message = JSON.stringify({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    })

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message)
        return
    }

    socket.addEventListener('open', () => {
        socket.send(message)
    }, { once: true })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscriberToTickerOnWs(ticker)
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
}

window.ticker = tickersHandlers