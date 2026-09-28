"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

const events = [
  {
    time: "02:40 PM",
    country: "US",
    flag: "🇺🇸",
    event: "Fed's Chair Powell speech",
    impact: "High",
    actual: "-",
    forecast: "-",
    previous: "-",
  },
  {
    time: "07:00 PM",
    country: "UK",
    flag: "🇬🇧",
    event: "Spring Bank Holiday",
    impact: "None",
    actual: "-",
    forecast: "-",
    previous: "-",
  },
  {
    time: "11:30 PM",
    country: "TH",
    flag: "🇹🇭",
    event: "Customs-Based Trade Balance",
    impact: "Low",
    actual: "-120B",
    forecast: "-",
    previous: "0.97B",
  },
]

export function EconomicCalendar() {
  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg">Economic Calendar</CardTitle>
        <p className="text-sm text-zinc-400">
          Today's economic data includes speeches from Fed officials and oil rig counts, with global markets watching
          for cues on interest rates and economic health.
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/80">
              <Search className="w-3 h-3 mr-2" />
              Search
            </Button>
            <Badge className="bg-zinc-800 text-zinc-300 h-8 border-zinc-700">
              Countries (24) <X className="w-3 h-3 ml-1 cursor-pointer" />
            </Badge>
            <Badge className="bg-zinc-800 text-zinc-300 h-8 border-zinc-700">
              Impact (4) <X className="w-3 h-3 ml-1 cursor-pointer" />
            </Badge>
          </div>
          <div className="flex items-center gap-1 bg-matte-black border border-zinc-800 rounded-md p-1">
            <Button size="sm" variant="ghost" className="h-6 text-xs text-zinc-400 hover:text-white">
              Today
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs text-zinc-400 hover:text-white">
              Tomorrow
            </Button>
            <Button
              size="sm"
              variant="default"
              className="h-6 text-xs bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold/20"
            >
              Week
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs text-zinc-400 hover:text-white">
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase border-b border-zinc-800">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Time
                </th>
                <th scope="col" className="px-4 py-3">
                  Country
                </th>
                <th scope="col" className="px-4 py-3">
                  Event Name
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Impact
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actual
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Forecast
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Previous
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td colSpan={7} className="px-4 py-2 text-zinc-300 font-semibold">
                  Sunday, May 25, 2025
                </td>
              </tr>
              {events.map((event, index) => (
                <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-400">{event.time}</td>
                  <td className="px-4 py-3 text-white">
                    {event.flag} {event.country}
                  </td>
                  <td className="px-4 py-3 text-white">{event.event}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={`text-xs ${
                        event.impact === "High"
                          ? "bg-scarlet-red/10 text-scarlet-red"
                          : event.impact === "Low"
                            ? "bg-muted-emerald/10 text-muted-emerald"
                            : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {event.impact}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-mono">{event.actual}</td>
                  <td className="px-4 py-3 text-right text-zinc-400 font-mono">{event.forecast}</td>
                  <td className="px-4 py-3 text-right text-zinc-400 font-mono">{event.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
