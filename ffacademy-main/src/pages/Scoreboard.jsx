import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Clock,
  PlayCircle,
  ChevronRight,
  Zap,
  Users,
  Target,
  AlertCircle
} from "lucide-react";
import LiveMatchupCard from "../components/scoreboard/LiveMatchupCard";
import PlayerPerformance from "../components/scoreboard/PlayerPerformance";
import GameTracker from "../components/scoreboard/GameTracker";

export default function Scoreboard() {
  const [selectedWeek, setSelectedWeek] = useState(14);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedMatchup, setSelectedMatchup] = useState(null);

  // Mock live NFL games data
  const liveGames = [
    { 
      id: 1, 
      away: "BUF", 
      home: "KC", 
      awayScore: 24, 
      homeScore: 21, 
      quarter: "Q4", 
      time: "5:42",
      status: "LIVE"
    },
    { 
      id: 2, 
      away: "DAL", 
      home: "PHI", 
      awayScore: 17, 
      homeScore: 28, 
      quarter: "Q3", 
      time: "8:15",
      status: "LIVE"
    },
    { 
      id: 3, 
      away: "SF", 
      home: "SEA", 
      awayScore: 14, 
      homeScore: 10, 
      quarter: "Q2", 
      time: "2:33",
      status: "LIVE"
    },
    { 
      id: 4, 
      away: "MIA", 
      home: "NE", 
      awayScore: 31, 
      homeScore: 27, 
      quarter: "FINAL", 
      time: "",
      status: "FINAL"
    }
  ];

  // Mock fantasy matchups
  const matchups = [
    {
      id: 1,
      team1: {
        name: "Your Team",
        manager: "You",
        score: 98.4,
        projected: 112.8,
        active: 5,
        played: 3,
        isUser: true
      },
      team2: {
        name: "The Gronkowskis",
        manager: "Mike",
        score: 87.2,
        projected: 104.3,
        active: 4,
        played: 4
      },
      status: "LIVE"
    },
    {
      id: 2,
      team1: {
        name: "Brady Bunch",
        manager: "Sarah",
        score: 102.6,
        projected: 98.5,
        active: 6,
        played: 2
      },
      team2: {
        name: "Mahomes Alone",
        manager: "John",
        score: 95.8,
        projected: 103.2,
        active: 5,
        played: 3
      },
      status: "LIVE"
    },
    {
      id: 3,
      team1: {
        name: "Allen's Army",
        manager: "Lisa",
        score: 118.3,
        projected: 115.7,
        active: 3,
        played: 5
      },
      team2: {
        name: "Hill's Angels",
        manager: "Tom",
        score: 89.4,
        projected: 108.9,
        active: 4,
        played: 4
      },
      status: "LIVE"
    }
  ];

  // Mock top performers
  const topPerformers = [
    { name: "Josh Allen", team: "BUF", position: "QB", points: 32.4, status: "LIVE", trend: "up" },
    { name: "Tyreek Hill", team: "MIA", position: "WR", points: 28.7, status: "FINAL", trend: "up" },
    { name: "Christian McCaffrey", team: "SF", position: "RB", points: 24.2, status: "LIVE", trend: "up" },
    { name: "Travis Kelce", team: "KC", position: "TE", points: 21.8, status: "LIVE", trend: "up" },
    { name: "CeeDee Lamb", team: "DAL", position: "WR", points: 19.3, status: "LIVE", trend: "down" }
  ];

  // Auto-refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <style>
        {`
          .neo-brutal-card {
            border: 4px solid #000000;
            box-shadow: 6px 6px 0px #000000;
          }
          
          .neo-brutal-button {
            border: 3px solid #000000 !important;
            box-shadow: 4px 4px 0px #000000 !important;
            transition: all 0.1s ease !important;
          }
          
          .neo-brutal-button:hover {
            transform: translate(-1px, -1px) !important;
            box-shadow: 5px 5px 0px #000000 !important;
          }
          
          .pulse-animation {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-black transform -rotate-1">
                LIVE SCOREBOARD
              </h1>
              {autoRefresh && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500 border-2 border-black">
                  <div className="w-2 h-2 bg-white rounded-full pulse-animation"></div>
                  <span className="font-black text-white text-sm">LIVE</span>
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-gray-600">
              Week {selectedWeek} • Last updated: {formatTime(lastUpdated)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`neo-brutal-button ${autoRefresh ? 'bg-green-500' : 'bg-gray-500'} text-white font-black`}
            >
              <Zap className="w-4 h-4 mr-2" />
              {autoRefresh ? 'AUTO-REFRESH ON' : 'AUTO-REFRESH OFF'}
            </Button>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="neo-brutal-button bg-white font-black px-4 py-2"
            >
              {Array.from({ length: 17 }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>WEEK {week}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Games Ticker */}
        <div className="neo-brutal-card bg-black p-4 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-white font-black whitespace-nowrap">
              <PlayCircle className="w-5 h-5" />
              LIVE GAMES:
            </div>
            {liveGames.map(game => (
              <div key={game.id} className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black whitespace-nowrap">
                <span className="font-black text-sm">
                  {game.away} {game.awayScore} - {game.homeScore} {game.home}
                </span>
                {game.status === "LIVE" && (
                  <Badge className="bg-red-500 text-white font-bold text-xs">
                    {game.quarter} {game.time}
                  </Badge>
                )}
                {game.status === "FINAL" && (
                  <Badge className="bg-gray-500 text-white font-bold text-xs">
                    FINAL
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Matchups Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">YOUR MATCHUPS</h2>
              <Badge className="bg-blue-500 text-white font-bold">
                {matchups.filter(m => m.status === "LIVE").length} LIVE
              </Badge>
            </div>

            {matchups.map(matchup => (
              <LiveMatchupCard 
                key={matchup.id} 
                matchup={matchup}
                onClick={() => setSelectedMatchup(matchup)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <div className="neo-brutal-card bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-black">TOP PERFORMERS</h3>
              </div>

              <div className="space-y-3">
                {topPerformers.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-100 border-2 border-black"
                  >
                    <div>
                      <div className="font-black text-sm">{player.name}</div>
                      <div className="font-bold text-xs text-gray-600">
                        {player.position} • {player.team}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-blue-600">
                        {player.points}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`text-xs ${
                          player.status === "LIVE" ? "bg-red-500" : "bg-gray-500"
                        } text-white`}>
                          {player.status}
                        </Badge>
                        {player.trend === "up" && <TrendingUp className="w-3 h-3 text-green-600" />}
                        {player.trend === "down" && <TrendingDown className="w-3 h-3 text-red-600" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* League Standings Preview */}
            <div className="neo-brutal-card bg-yellow-300 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6" />
                <h3 className="text-xl font-black">STANDINGS</h3>
              </div>

              <div className="space-y-2">
                {[
                  { rank: 1, team: "Your Team", record: "10-3", pts: 1456.8 },
                  { rank: 2, team: "Allen's Army", record: "9-4", pts: 1442.3 },
                  { rank: 3, team: "Brady Bunch", record: "9-4", pts: 1398.6 },
                  { rank: 4, team: "Mahomes Alone", record: "8-5", pts: 1376.2 }
                ].map(team => (
                  <div key={team.rank} className="flex items-center justify-between p-2 bg-white border-2 border-black">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                        {team.rank}
                      </div>
                      <div>
                        <div className="font-black text-sm">{team.team}</div>
                        <div className="font-bold text-xs text-gray-600">{team.record}</div>
                      </div>
                    </div>
                    <div className="font-black text-sm">{team.pts}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="neo-brutal-card bg-blue-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6" />
                <h3 className="text-xl font-black">WEEK {selectedWeek} STATS</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Highest Score:</span>
                  <span className="font-black text-lg">142.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Average Score:</span>
                  <span className="font-black text-lg">98.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Games Completed:</span>
                  <span className="font-black text-lg">4/12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Close Matchups:</span>
                  <span className="font-black text-lg text-orange-600">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matchup Detail Modal */}
        <AnimatePresence>
          {selectedMatchup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMatchup(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="neo-brutal-card bg-white p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black">MATCHUP DETAILS</h3>
                  <Button
                    onClick={() => setSelectedMatchup(null)}
                    className="neo-brutal-button bg-gray-500 text-white font-black"
                  >
                    CLOSE
                  </Button>
                </div>

                <PlayerPerformance matchup={selectedMatchup} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}