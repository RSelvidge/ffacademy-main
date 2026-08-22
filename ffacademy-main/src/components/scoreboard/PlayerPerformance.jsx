import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

export default function PlayerPerformance({ matchup }) {
  // Mock player data for both teams
  const team1Players = [
    { name: "Josh Allen", position: "QB", team: "BUF", points: 24.3, projected: 22.5, status: "LIVE" },
    { name: "Derrick Henry", position: "RB", team: "TEN", points: 18.7, projected: 16.2, status: "LIVE" },
    { name: "Josh Jacobs", position: "RB", team: "LV", points: 14.2, projected: 15.8, status: "FINAL" },
    { name: "Tyreek Hill", position: "WR", team: "MIA", points: 22.1, projected: 18.4, status: "FINAL" },
    { name: "Cooper Kupp", position: "WR", team: "LAR", points: 12.8, projected: 14.6, status: "LIVE" },
    { name: "Travis Kelce", position: "TE", team: "KC", points: 15.4, projected: 13.2, status: "LIVE" },
    { name: "Tony Pollard", position: "FLEX", team: "DAL", points: 8.9, projected: 11.5, status: "LIVE" },
    { name: "Justin Tucker", position: "K", team: "BAL", points: 9.0, projected: 8.5, status: "FINAL" },
    { name: "Bills D/ST", position: "DEF", team: "BUF", points: 12.0, projected: 9.8, status: "LIVE" }
  ];

  const team2Players = [
    { name: "Lamar Jackson", position: "QB", team: "BAL", points: 19.4, projected: 21.8, status: "FINAL" },
    { name: "Christian McCaffrey", position: "RB", team: "SF", points: 16.8, projected: 18.2, status: "LIVE" },
    { name: "Alvin Kamara", position: "RB", team: "NO", points: 11.3, projected: 14.6, status: "LIVE" },
    { name: "CeeDee Lamb", position: "WR", team: "DAL", points: 15.2, projected: 16.8, status: "LIVE" },
    { name: "Davante Adams", position: "WR", team: "LV", points: 9.8, projected: 13.4, status: "FINAL" },
    { name: "Mark Andrews", position: "TE", team: "BAL", points: 8.4, projected: 11.2, status: "FINAL" },
    { name: "Deebo Samuel", position: "FLEX", team: "SF", points: 7.6, projected: 12.8, status: "LIVE" },
    { name: "Harrison Butker", position: "K", team: "KC", points: 11.0, projected: 8.2, status: "LIVE" },
    { name: "Cowboys D/ST", position: "DEF", team: "DAL", points: 8.0, projected: 10.5, status: "LIVE" }
  ];

  const renderPlayerRow = (player) => {
    const diff = player.points - player.projected;
    const isOutperforming = diff > 0;

    return (
      <div key={player.name} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black mb-2">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 text-center">
            <Badge className={`${
              player.position === 'QB' ? 'bg-red-500' :
              player.position === 'RB' ? 'bg-blue-500' :
              player.position === 'WR' ? 'bg-green-500' :
              player.position === 'TE' ? 'bg-yellow-600' :
              player.position === 'K' ? 'bg-purple-500' :
              'bg-gray-700'
            } text-white font-black text-xs`}>
              {player.position}
            </Badge>
          </div>
          <div className="flex-1">
            <div className="font-black text-sm">{player.name}</div>
            <div className="font-bold text-xs text-gray-600">{player.team}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {player.status === "LIVE" ? (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-500" />
              <Badge className="bg-red-500 text-white font-bold text-xs">LIVE</Badge>
            </div>
          ) : (
            <Badge className="bg-gray-500 text-white font-bold text-xs">FINAL</Badge>
          )}

          <div className="text-right w-20">
            <div className="font-black text-lg">{player.points.toFixed(1)}</div>
            <div className="font-bold text-xs text-gray-500">
              proj: {player.projected.toFixed(1)}
            </div>
          </div>

          <div className="w-8 flex justify-center">
            {isOutperforming ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Team 1 */}
      <div>
        <div className="mb-4 p-3 bg-blue-500 border-3 border-black">
          <h4 className="font-black text-xl text-white">{matchup.team1.name}</h4>
          <div className="font-bold text-sm text-blue-100">{matchup.team1.manager}</div>
        </div>

        <div className="space-y-0">
          {team1Players.map(renderPlayerRow)}
        </div>

        <div className="mt-4 p-3 bg-yellow-300 border-2 border-black">
          <div className="flex justify-between items-center">
            <span className="font-black">TOTAL</span>
            <span className="font-black text-2xl">{matchup.team1.score.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Team 2 */}
      <div>
        <div className="mb-4 p-3 bg-orange-500 border-3 border-black">
          <h4 className="font-black text-xl text-white">{matchup.team2.name}</h4>
          <div className="font-bold text-sm text-orange-100">{matchup.team2.manager}</div>
        </div>

        <div className="space-y-0">
          {team2Players.map(renderPlayerRow)}
        </div>

        <div className="mt-4 p-3 bg-yellow-300 border-2 border-black">
          <div className="flex justify-between items-center">
            <span className="font-black">TOTAL</span>
            <span className="font-black text-2xl">{matchup.team2.score.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}