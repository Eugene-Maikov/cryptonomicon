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

function sendToWebSocket(message) {
    const stringifyMessage = JSON.stringify(message)
    
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifyMessage)
        return
    }

    socket.addEventListener('open', () => {
        socket.send(stringifyMessage)
    }, { once: true })
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    })
}

function unsubscribeFromTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`]
    })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWs(ticker)
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
    unsubscribeFromTickerOnWs(ticker)
}

window.ticker = tickersHandlers