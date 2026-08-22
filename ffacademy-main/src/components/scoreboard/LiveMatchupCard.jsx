import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, ChevronRight } from "lucide-react";

export default function LiveMatchupCard({ matchup, onClick }) {
  const team1Winning = matchup.team1.score > matchup.team2.score;
  const team2Winning = matchup.team2.score > matchup.team1.score;
  const scoreDiff = Math.abs(matchup.team1.score - matchup.team2.score);
  const isClose = scoreDiff < 10;

  return (
    <motion.div
      className="neo-brutal-card bg-white p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {matchup.status === "LIVE" && (
            <Badge className="bg-red-500 text-white font-bold animate-pulse">
              LIVE
            </Badge>
          )}
          {isClose && (
            <Badge className="bg-orange-500 text-white font-bold">
              CLOSE GAME
            </Badge>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Team 1 */}
        <div className={`p-4 border-3 border-black ${
          team1Winning ? 'bg-green-100' : 'bg-gray-100'
        } ${matchup.team1.isUser ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-black text-lg">{matchup.team1.name}</div>
              <div className="font-bold text-sm text-gray-600">{matchup.team1.manager}</div>
            </div>
            <div className="text-right">
              <div className="font-black text-3xl text-blue-600">
                {matchup.team1.score.toFixed(1)}
              </div>
              <div className="font-bold text-xs text-gray-600">
                proj: {matchup.team1.projected.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{matchup.team1.active} playing</span>
            </div>
            <div>{matchup.team1.played} finished</div>
            <div className="ml-auto flex items-center gap-1">
              {matchup.team1.score > matchup.team1.projected ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Outperforming</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">Underperforming</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <div className="inline-block px-4 py-1 bg-black text-white font-black text-sm">
            VS
          </div>
        </div>

        {/* Team 2 */}
        <div className={`p-4 border-3 border-black ${
          team2Winning ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-black text-lg">{matchup.team2.name}</div>
              <div className="font-bold text-sm text-gray-600">{matchup.team2.manager}</div>
            </div>
            <div className="text-right">
              <div className="font-black text-3xl text-blue-600">
                {matchup.team2.score.toFixed(1)}
              </div>
              <div className="font-bold text-xs text-gray-600">
                proj: {matchup.team2.projected.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{matchup.team2.active} playing</span>
            </div>
            <div>{matchup.team2.played} finished</div>
            <div className="ml-auto flex items-center gap-1">
              {matchup.team2.score > matchup.team2.projected ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Outperforming</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">Underperforming</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Score Difference */}
      <div className="mt-4 text-center">
        <div className="inline-block px-3 py-1 bg-yellow-300 border-2 border-black">
          <span className="font-black text-sm">
            {team1Winning ? matchup.team1.name : matchup.team2.name} leads by {scoreDiff.toFixed(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}