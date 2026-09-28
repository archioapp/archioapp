import { getInstrumentById } from "./instruments"

const API_KEY = "QL4NO9TEBD05L85U"

async function fetchApi(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data["Error Message"] || data["Note"]) {
      console.warn("Alpha Vantage API error/note:", data["Error Message"] || data["Note"])
      return null
    }
    return data
  } catch (error) {
    console.error("Failed to fetch from Alpha Vantage API:", error)
    return null
  }
}

const getForexPrice = async (from: string, to: string): Promise<number | null> => {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API_KEY}`
  const data = await fetchApi(url)
  if (data && data["Realtime Currency Exchange Rate"]) {
    return Number.parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
  }
  return null
}

const getStockPrice = async (symbol: string): Promise<number | null> => {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  const data = await fetchApi(url)
  if (data && data["Global Quote"]) {
    return Number.parseFloat(data["Global Quote"]["05. price"])
  }
  return null
}

const getCryptoPrice = async (from: string, to = "USD"): Promise<number | null> => {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API_KEY}`
  const data = await fetchApi(url)
  if (data && data["Realtime Currency Exchange Rate"]) {
    return Number.parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
  }
  return null
}

export const PriceService = {
  async getCurrentPrice(instrumentId: string): Promise<number | null> {
    const instrument = getInstrumentById(instrumentId)
    if (!instrument) {
      console.error(`Instrument with id ${instrumentId} not found.`)
      return null
    }

    const apiSymbol = instrument.apiSymbol || instrument.symbol

    switch (instrument.category) {
      case "Forex":
        const toCurrency = instrument.id.endsWith("JPY") ? "JPY" : "USD"
        return getForexPrice(apiSymbol, toCurrency)
      case "Crypto":
        return getCryptoPrice(apiSymbol, "USD")
      case "Indices":
      case "Commodities":
        return getStockPrice(apiSymbol)
      default:
        return null
    }
  },

  startPriceUpdates(instrumentId: string, callback: (price: number) => void): NodeJS.Timeout | null {
    const instrument = getInstrumentById(instrumentId)
    if (!instrument) {
      console.error(`Cannot start price updates for unknown instrument: ${instrumentId}`)
      return null
    }

    const fetchAndUpdate = async () => {
      const price = await this.getCurrentPrice(instrumentId)
      if (price !== null) {
        callback(price)
      }
    }

    fetchAndUpdate()
    // Alpha Vantage free tier has a limit of 25 requests per day.
    // Set interval to a higher value for demo purposes.
    const intervalId = setInterval(fetchAndUpdate, 60000) // 60 seconds
    return intervalId
  },
}
