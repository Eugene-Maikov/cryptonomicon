const API_KEY = "55e56755aa0c1e5cde441ba9d201d24896c2a99f66e9a081040c95fea910ca83"

export const loadTicker = tickerName => 
fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
).then(r => r.json())
