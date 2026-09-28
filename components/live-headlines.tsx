"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const headlines = [
  {
    time: "May 24, 2025 11:29 PM - 10 hours ago",
    content:
      "CHINA PREMIER LI, IN MEETING WITH INDONESIA PRESIDENT: CHINA IS WILLING TO WORK TOGETHER WITH INDONESIA TO TACKLE RISKS AND CHALLENGES",
  },
  {
    time: "May 24, 2025 11:27 PM - 10 hours ago",
    content:
      "CHINA PREMIER LI, IN MEETING WITH INDONESIA PRESIDENT: CHINA IS WILLING TO UPHOLD THE ORIGINAL ASPIRATION BEHIND THE ESTABLISHMENT OF OUR DIPLOMATIC RELATIONS",
  },
  {
    time: "May 24, 2025 11:27 PM - 10 hours ago",
    content:
      "CHINA PREMIER LI, IN MEETING WITH INDONESIA PRESIDENT: CHINA IS WILLING TO WORK TO CARRY FORWARD THE TRADITION OF FRIENDSHIP BETWEEN OUR TWO COUNTRIES",
  },
  {
    time: "May 24, 2025 11:26 PM - 10 hours ago",
    content:
      "CHINA PREMIER LI, IN MEETING WITH INDONESIA PRESIDENT: THE INTERNATIONAL SITUATION IS IN TURMOIL, PEACEFUL DEVELOPMENT IS FACING MANY UNCERTAIN AND UNSTABLE FACTORS",
  },
]

export function LiveHeadlines() {
  return (
    <Card className="bg-slate-grey border border-zinc-800 rounded-xl h-full group">
      <CardHeader>
        <CardTitle className="text-white text-lg">What's Happening in the Markets</CardTitle>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold text-xs h-8 shadow-lg"
            >
              Live Headlines
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white text-xs h-8">
              Summary
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white text-xs h-8">
              Recent News
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-xs h-8 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/80">
              <Search className="w-3 h-3 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="text-xs h-8 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/80">
              AI Highlights
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pr-2">
        <ul className="space-y-4 h-[250px] overflow-y-auto">
          {headlines.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-4 group/item p-2 rounded-md hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-2 h-2 mt-1.5 rounded-full bg-luxury-gold transition-all duration-300 group-hover/item:shadow-[0_0_10px_#D4AF37]" />
              <div>
                <p className="text-xs text-zinc-500">{item.time}</p>
                <p className="text-sm text-zinc-300 group-hover/item:text-white transition-colors">{item.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
