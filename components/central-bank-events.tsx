"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

const banks = ["FED", "ECB", "BOE", "BOJ", "SNB", "RBA", "RBNZ", "BOC", "PBOC", "CBR"]
const stanceData = [
  { name: "May 22", value: 2 },
  { name: "Sep 22", value: 3 },
  { name: "Feb 23", value: 4 },
  { name: "Jun 23", value: 5 },
  { name: "Nov 23", value: 6 },
  { name: "Mar 24", value: 5.5 },
  { name: "Jul 24", value: 5 },
  { name: "Dec 24", value: 4.5 },
  { name: "May 25", value: 4 },
]
const upcomingEvents = [
  { date: "25", month: "May", time: "2:40 PM", event: "Fed's Chair Powell speech", color: "bg-scarlet-red" },
  { date: "27", month: "May", time: "4:00 AM", event: "Fed's Kashkari speech", color: "bg-metallic-bronze" },
  { date: "27", month: "May", time: "8:00 PM", event: "Fed's Williams speech", color: "bg-luxury-gold" },
  { date: "27", month: "May", time: "10:10 PM", event: "Fed's Waller speech", color: "bg-luxury-gold" },
]

export function CentralBankEvents() {
  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg">Central Bank Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {banks.map((bank) => (
            <Badge
              key={bank}
              variant={bank === "FED" ? "default" : "secondary"}
              className={`text-xs transition-all ${bank === "FED" ? "bg-luxury-gold/10 text-luxury-gold shadow-lg" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
            >
              {bank}
            </Badge>
          ))}
        </div>
        <div className="flex items-start gap-3 mb-6 p-3 bg-matte-black/50 rounded-lg border border-zinc-800">
          <Brain className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
          <p className="text-zinc-300 text-sm">
            FED maintains rates at 4.25-4.5% amid solid economic activity, citing elevated inflation and increased risks
            to dual mandate goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-2">Current Stance</h4>
            <Badge variant="secondary" className="mb-3 bg-zinc-800 text-zinc-300">
              Neutral
            </Badge>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stanceData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(212, 175, 55, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "rgba(19, 19, 22, 0.9)",
                      border: "1px solid #3A3A43",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Upcoming Central Bank Events</h4>
            <ul className="space-y-4">
              {upcomingEvents.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 hover:bg-zinc-800/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full ${item.color}`} />
                    <div className="text-center">
                      <div className="font-bold text-white text-lg">{item.date}</div>
                      <div className="text-xs text-zinc-400 -mt-1">{item.month}</div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-white font-medium">{item.event}</p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <Brain className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
