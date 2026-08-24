import React from "react";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";

export default function GameTracker({ games }) {
  return (
    <div className="neo-brutal-card bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <PlayCircle className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-black">NFL GAME TRACKER</h3>
      </div>

      <div className="space-y-3">
        {games.map(game => (
          <div key={game.id} className="p-3 bg-gray-100 border-2 border-black">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-black text-sm">{game.away}</div>
                  <div className="font-black text-2xl text-blue-600">{game.awayScore}</div>
                </div>
                <div className="font-black text-gray-400">@</div>
                <div className="text-center">
                  <div className="font-black text-sm">{game.home}</div>
                  <div className="font-black text-2xl text-blue-600">{game.homeScore}</div>
                </div>
              </div>

              <div className="text-right">
                {game.status === "LIVE" ? (
                  <>
                    <Badge className="bg-red-500 text-white font-bold mb-1">LIVE</Badge>
                    <div className="font-black text-sm">{game.quarter}</div>
                    <div className="font-bold text-xs text-gray-600">{game.time}</div>
                  </>
                ) : (
                  <Badge className="bg-gray-500 text-white font-bold">FINAL</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}