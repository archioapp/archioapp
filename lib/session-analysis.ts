export interface SessionData {
  name: string
  startTime: number
  endTime: number
  high: number
  low: number
  open: number
  close: number
  range: number
  isActive: boolean
  color: string
  borderColor: string
}

export interface SessionAnalysis {
  asiaSession: SessionData
  previousDaily: SessionData
  previousWeekly: SessionData
  currentPrice: number
  timestamp: number
}

class SessionAnalysisEngine {
  private getESTTime(date: Date): Date {
    // Convert to EST (UTC-5) or EDT (UTC-4) depending on daylight saving
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const est = new Date(utc + -5 * 3600000) // EST is UTC-5
    return est
  }

  private getAsiaSessionBounds(): { start: Date; end: Date } {
    const now = new Date()
    const est = this.getESTTime(now)

    // Asia session: 8pm to 12am EST
    const sessionStart = new Date(est)
    sessionStart.setHours(20, 0, 0, 0) // 8pm EST

    const sessionEnd = new Date(est)
    sessionEnd.setHours(24, 0, 0, 0) // 12am EST (midnight)

    // If current time is before 8pm, use previous day's session
    if (est.getHours() < 20) {
      sessionStart.setDate(sessionStart.getDate() - 1)
      sessionEnd.setDate(sessionEnd.getDate() - 1)
    }

    return { start: sessionStart, end: sessionEnd }
  }

  private getPreviousDailyBounds(): { start: Date; end: Date } {
    const now = new Date()
    const est = this.getESTTime(now)

    // Previous daily: 5pm to 5pm EST (previous day)
    const sessionEnd = new Date(est)
    sessionEnd.setHours(17, 0, 0, 0) // 5pm EST today

    const sessionStart = new Date(sessionEnd)
    sessionStart.setDate(sessionStart.getDate() - 1) // 5pm EST yesterday

    // If current time is before 5pm, use the session that just ended
    if (est.getHours() < 17) {
      sessionEnd.setDate(sessionEnd.getDate() - 1)
      sessionStart.setDate(sessionStart.getDate() - 1)
    }

    return { start: sessionStart, end: sessionEnd }
  }

  private getPreviousWeeklyBounds(): { start: Date; end: Date } {
    const now = new Date()
    const est = this.getESTTime(now)

    // Previous weekly: Sunday 5pm to Friday 5pm EST
    const currentDay = est.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Find the most recent Friday 5pm
    const sessionEnd = new Date(est)
    const daysToFriday = currentDay <= 5 ? currentDay + 2 : currentDay - 5
    sessionEnd.setDate(sessionEnd.getDate() - daysToFriday)
    sessionEnd.setHours(17, 0, 0, 0) // Friday 5pm

    // Find the Sunday 5pm before that Friday
    const sessionStart = new Date(sessionEnd)
    sessionStart.setDate(sessionStart.getDate() - 5) // 5 days back to Sunday

    return { start: sessionStart, end: sessionEnd }
  }

  private generateSessionPriceData(
    startTime: number,
    endTime: number,
    basePrice: number,
  ): {
    high: number
    low: number
    open: number
    close: number
  } {
    // Generate realistic price movement within the session
    const volatility = 0.002 // 0.2% volatility
    const open = basePrice + (Math.random() - 0.5) * volatility

    // Generate some price points during the session
    const pricePoints = [open]
    const sessionDuration = endTime - startTime
    const intervals = 20 // 20 price points during session

    for (let i = 1; i < intervals; i++) {
      const prevPrice = pricePoints[i - 1]
      const change = (Math.random() - 0.5) * volatility * 0.3
      pricePoints.push(prevPrice + change)
    }

    const close = pricePoints[pricePoints.length - 1]
    const high = Math.max(...pricePoints) + Math.random() * volatility * 0.2
    const low = Math.min(...pricePoints) - Math.random() * volatility * 0.2

    return { high, low, open, close }
  }

  private isSessionActive(startTime: number, endTime: number): boolean {
    const now = Date.now()
    return now >= startTime && now <= endTime
  }

  private async captureTokyoLevels(symbol: string): Promise<{ high: number; low: number }> {
    // In production, this would fetch real market data from your trading API
    // For now, we simulate realistic Tokyo session levels
    const basePrice = 1.2345 + (Math.random() - 0.5) * 0.01
    const volatility = 0.002

    return {
      high: basePrice + Math.random() * volatility,
      low: basePrice - Math.random() * volatility,
    }
  }

  async analyzeSessionData(symbol: string): Promise<SessionAnalysis> {
    // In a real implementation, this would fetch actual market data
    // For now, we'll generate realistic sample data based on current market conditions
    const currentPrice = 1.2345 + (Math.random() - 0.5) * 0.01

    // Get session time bounds
    const asiaBounds = this.getAsiaSessionBounds()
    const dailyBounds = this.getPreviousDailyBounds()
    const weeklyBounds = this.getPreviousWeeklyBounds()

    // Capture Tokyo levels for Asia session
    const tokyoLevels = await this.captureTokyoLevels(symbol)

    // Generate price data for each session
    const asiaData = this.generateSessionPriceData(asiaBounds.start.getTime(), asiaBounds.end.getTime(), currentPrice)
    // Override with Tokyo levels
    asiaData.high = tokyoLevels.high
    asiaData.low = tokyoLevels.low

    const dailyData = this.generateSessionPriceData(
      dailyBounds.start.getTime(),
      dailyBounds.end.getTime(),
      currentPrice,
    )

    const weeklyData = this.generateSessionPriceData(
      weeklyBounds.start.getTime(),
      weeklyBounds.end.getTime(),
      currentPrice,
    )

    const asiaSession: SessionData = {
      name: "Asia Session",
      startTime: asiaBounds.start.getTime(),
      endTime: asiaBounds.end.getTime(),
      high: asiaData.high,
      low: asiaData.low,
      open: asiaData.open,
      close: asiaData.close,
      range: asiaData.high - asiaData.low,
      isActive: this.isSessionActive(asiaBounds.start.getTime(), asiaBounds.end.getTime()),
      color: "rgba(147, 51, 234, 0.2)", // Purple with transparency
      borderColor: "rgba(147, 51, 234, 0.6)",
    }

    const previousDaily: SessionData = {
      name: "Previous Daily",
      startTime: dailyBounds.start.getTime(),
      endTime: dailyBounds.end.getTime(),
      high: dailyData.high,
      low: dailyData.low,
      open: dailyData.open,
      close: dailyData.close,
      range: dailyData.high - dailyData.low,
      isActive: false,
      color: "rgba(59, 130, 246, 0.2)", // Blue with transparency
      borderColor: "rgba(59, 130, 246, 0.6)",
    }

    const previousWeekly: SessionData = {
      name: "Previous Weekly",
      startTime: weeklyBounds.start.getTime(),
      endTime: weeklyBounds.end.getTime(),
      high: weeklyData.high,
      low: weeklyData.low,
      open: weeklyData.open,
      close: weeklyData.close,
      range: weeklyData.high - weeklyData.low,
      isActive: false,
      color: "rgba(16, 185, 129, 0.2)", // Green with transparency
      borderColor: "rgba(16, 185, 129, 0.6)",
    }

    return {
      asiaSession,
      previousDaily,
      previousWeekly,
      currentPrice,
      timestamp: Date.now(),
    }
  }

  formatSessionTime(timestamp: number): string {
    const date = new Date(timestamp)
    const est = this.getESTTime(date)
    return est.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  }
}

export const sessionAnalysisEngine = new SessionAnalysisEngine()
