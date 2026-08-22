
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  Target,
  AlertTriangle,
  Play,
  Settings,
  Zap,
  Activity,
  Calendar
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Enhanced mock player pool with more players and defenses
const mockPlayerPool = [
  // QBs
  { id: 1, name: "Josh Allen", position: "QB", team: "BUF", projectedPoints: 24.8, salary: 8500, tier: "elite", injury_risk: "low", drafted: false },
  { id: 2, name: "Lamar Jackson", position: "QB", team: "BAL", projectedPoints: 23.2, salary: 8200, tier: "elite", injury_risk: "medium", drafted: false },
  { id: 3, name: "Dak Prescott", position: "QB", team: "DAL", projectedPoints: 19.4, salary: 7200, tier: "mid", injury_risk: "low", drafted: false },
  { id: 4, name: "Geno Smith", position: "QB", team: "SEA", projectedPoints: 16.8, salary: 6400, tier: "low", injury_risk: "low", drafted: false },
  { id: 5, name: "Justin Herbert", position: "QB", team: "LAC", projectedPoints: 22.1, salary: 7800, tier: "elite", injury_risk: "low", drafted: false },
  { id: 6, name: "Tua Tagovailoa", position: "QB", team: "MIA", projectedPoints: 18.7, salary: 6800, tier: "mid", injury_risk: "high", drafted: false },
  
  // RBs
  { id: 7, name: "Christian McCaffrey", position: "RB", team: "SF", projectedPoints: 18.2, salary: 9000, tier: "elite", injury_risk: "high", drafted: false },
  { id: 8, name: "Derrick Henry", position: "RB", team: "BAL", projectedPoints: 15.8, salary: 7800, tier: "elite", injury_risk: "medium", drafted: false },
  { id: 9, name: "Josh Jacobs", position: "RB", team: "LV", projectedPoints: 14.2, salary: 7200, tier: "mid", injury_risk: "low", drafted: false },
  { id: 10, name: "Alexander Mattison", position: "RB", team: "LV", projectedPoints: 8.4, salary: 4800, tier: "low", injury_risk: "low", drafted: false },
  { id: 11, name: "Raheem Mostert", position: "RB", team: "MIA", projectedPoints: 11.6, salary: 5600, tier: "mid", injury_risk: "high", drafted: false },
  { id: 12, name: "Zack Moss", position: "RB", team: "CIN", projectedPoints: 7.2, salary: 4200, tier: "low", injury_risk: "low", drafted: false },
  { id: 13, name: "Saquon Barkley", position: "RB", team: "PHI", projectedPoints: 16.5, salary: 8200, tier: "elite", injury_risk: "medium", drafted: false },
  { id: 14, name: "Breece Hall", position: "RB", team: "NYJ", projectedPoints: 15.1, salary: 7600, tier: "elite", injury_risk: "low", drafted: false },
  
  // WRs
  { id: 15, name: "Tyreek Hill", position: "WR", team: "MIA", projectedPoints: 16.4, salary: 8800, tier: "elite", injury_risk: "low", drafted: false },
  { id: 16, name: "Cooper Kupp", position: "WR", team: "LAR", projectedPoints: 15.2, salary: 8400, tier: "elite", injury_risk: "medium", drafted: false },
  { id: 17, name: "Amon-Ra St. Brown", position: "WR", team: "DET", projectedPoints: 13.8, salary: 7600, tier: "mid", injury_risk: "low", drafted: false },
  { id: 18, name: "DJ Moore", position: "WR", team: "CHI", projectedPoints: 12.4, salary: 6800, tier: "mid", injury_risk: "low", drafted: false },
  { id: 19, name: "Romeo Doubs", position: "WR", team: "GB", projectedPoints: 9.6, salary: 5200, tier: "low", injury_risk: "low", drafted: false },
  { id: 20, name: "Darius Slayton", position: "WR", team: "NYG", projectedPoints: 8.2, salary: 4600, tier: "low", injury_risk: "low", drafted: false },
  { id: 21, name: "CeeDee Lamb", position: "WR", team: "DAL", projectedPoints: 17.8, salary: 9200, tier: "elite", injury_risk: "low", drafted: false },
  { id: 22, name: "Ja'Marr Chase", position: "WR", team: "CIN", projectedPoints: 16.9, salary: 8600, tier: "elite", injury_risk: "low", drafted: false },
  
  // TEs
  { id: 23, name: "Travis Kelce", position: "TE", team: "KC", projectedPoints: 14.6, salary: 7800, tier: "elite", injury_risk: "low", drafted: false },
  { id: 24, name: "Mark Andrews", position: "TE", team: "BAL", projectedPoints: 11.8, salary: 6400, tier: "mid", injury_risk: "medium", drafted: false },
  { id: 25, name: "Kyle Pitts", position: "TE", team: "ATL", projectedPoints: 9.4, salary: 5600, tier: "mid", injury_risk: "low", drafted: false },
  { id: 26, name: "Tyler Higbee", position: "TE", team: "LAR", projectedPoints: 6.8, salary: 4200, tier: "low", injury_risk: "low", drafted: false },
  { id: 27, name: "George Kittle", position: "TE", team: "SF", projectedPoints: 12.3, salary: 6800, tier: "mid", injury_risk: "medium", drafted: false },
  
  // Defenses
  { id: 28, name: "49ers D/ST", position: "DEF", team: "SF", projectedPoints: 8.5, salary: 3200, tier: "elite", injury_risk: "low", drafted: false },
  { id: 29, name: "Cowboys D/ST", position: "DEF", team: "DAL", projectedPoints: 7.8, salary: 2800, tier: "mid", injury_risk: "low", drafted: false },
  { id: 30, name: "Bills D/ST", position: "DEF", team: "BUF", projectedPoints: 7.2, salary: 2600, tier: "mid", injury_risk: "low", drafted: false },
  { id: 31, name: "Browns D/ST", position: "DEF", team: "CLE", projectedPoints: 6.5, salary: 2400, tier: "low", injury_risk: "low", drafted: false },
  { id: 32, name: "Ravens D/ST", position: "DEF", team: "BAL", projectedPoints: 6.8, salary: 2500, tier: "low", injury_risk: "low", drafted: false }
];

const quickScenarios = [
  {
    id: 1,
    title: "LINEUP DECISIONS",
    description: "Choose your optimal starting lineup for this week",
    type: "lineup"
  },
  {
    id: 2,
    title: "TRADE EVALUATION", 
    description: "Evaluate whether you should accept this trade offer",
    type: "trade"
  },
  {
    id: 3,
    title: "WAIVER WIRE",
    description: "Decide which players to pick up from waivers",
    type: "waiver"
  }
];

const AIManagers = [
  { id: 1, name: "THE ANALYZER", strategy: "analytics", avatar: "🤖", record: "0-0", totalPoints: 0 },
  { id: 2, name: "TRADE MASTER", strategy: "aggressive", avatar: "📈", record: "0-0", totalPoints: 0 },
  { id: 3, name: "SAFE PLAY", strategy: "conservative", avatar: "🛡️", record: "0-0", totalPoints: 0 }
];

export default function Simulator() {
  const [activeMode, setActiveMode] = useState('quick');
  const [activeScenario, setActiveScenario] = useState(null);
  
  // Full Sim State
  const [currentWeek, setCurrentWeek] = useState(1);
  const [gamePhase, setGamePhase] = useState('draft'); // 'draft', 'playing', 'completed'
  const [draftPhase, setDraftPhase] = useState('in_progress'); // 'waiting', 'in_progress', 'completed'
  const [currentDraftPick, setCurrentDraftPick] = useState(0);
  const [draftOrder, setDraftOrder] = useState([]);
  const [playerPool, setPlayerPool] = useState([...mockPlayerPool]);
  const [myLineup, setMyLineup] = useState({
    QB: null,
    RB1: null, 
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    FLEX: null,
    DEF: null
  });
  const [aiLineups, setAiLineups] = useState({});
  const [weekEvents, setWeekEvents] = useState([]);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [simulationSettings, setSimulationSettings] = useState({
    injuryChance: 5,
    tradeFrequency: 20,
    waiversActivity: 50,
    weatherImpact: true,
    forceInjury: null,
    forceTrade: false
  });
  const [leaderboard, setLeaderboard] = useState([
    { manager: "YOU", points: 0, record: "0-0", weeklyScores: [] },
    ...AIManagers.map(ai => ({ manager: ai.name, points: 0, record: ai.record, weeklyScores: [] }))
  ]);

  const startFullSim = () => {
    setActiveMode('full');
    initializeDraft();
  };

  const initializeDraft = () => {
    // Create snake draft order (4 teams, 8 rounds)
    const order = [];
    const totalManagers = 4; // You + 3 AI
    const totalRounds = 8;
    
    for (let round = 1; round <= totalRounds; round++) {
      if (round % 2 === 1) {
        // Odd rounds: normal order
        for (let pick = 0; pick < totalManagers; pick++) {
          order.push(pick);
        }
      } else {
        // Even rounds: reverse order (snake)
        for (let pick = totalManagers - 1; pick >= 0; pick--) {
          order.push(pick);
        }
      }
    }
    
    setDraftOrder(order);
    setCurrentDraftPick(0);
    setGamePhase('draft');
    setDraftPhase('in_progress');
    
    // Initialize empty lineups for AI
    const emptyLineup = {
      QB: null, RB1: null, RB2: null, WR1: null, WR2: null, TE: null, FLEX: null, DEF: null
    };
    setAiLineups({
      1: {...emptyLineup},
      2: {...emptyLineup}, 
      3: {...emptyLineup}
    });
    
    // Reset player pool
    setPlayerPool(mockPlayerPool.map(p => ({...p, drafted: false})));
  };

  const addPlayerToLineup = (player, isUserPick = false) => {
    if (gamePhase !== 'draft' || player.drafted) return false;

    const currentManager = draftOrder[currentDraftPick];
    
    // If it's the user's turn but they didn't initiate the pick, return
    if (currentManager === 0 && !isUserPick) return false;
    
    // Mark player as drafted
    setPlayerPool(prev => prev.map(p => 
      p.id === player.id ? {...p, drafted: true} : p
    ));

    if (currentManager === 0) {
      // User's pick
      const newLineup = {...myLineup};
      const position = findBestPosition(player, newLineup);
      if (position) {
        newLineup[position] = player;
        setMyLineup(newLineup);
      }
    } else {
      // AI pick
      setAiLineups(prev => {
        const aiLineup = {...prev[currentManager]};
        const position = findBestPosition(player, aiLineup);
        if (position) {
          aiLineup[position] = player;
        }
        return {
          ...prev,
          [currentManager]: aiLineup
        };
      });
    }

    // Move to next pick FIRST
    const nextPickIndex = currentDraftPick + 1;
    
    if (nextPickIndex < draftOrder.length) {
      setCurrentDraftPick(nextPickIndex);
      
      // Then check if next pick is AI and auto-draft
      const nextManager = draftOrder[nextPickIndex];
      if (nextManager !== 0) {
        setTimeout(() => {
          aiAutoDraft(nextManager, nextPickIndex);
        }, 1500);
      }
    } else {
      // Draft complete
      setDraftPhase('completed');
      setGamePhase('playing');
    }

    return true;
  };

  const findBestPosition = (player, lineup) => {
    const positionPriority = {
      QB: ['QB'],
      RB: ['RB1', 'RB2', 'FLEX'],
      WR: ['WR1', 'WR2', 'FLEX'], 
      TE: ['TE', 'FLEX'],
      DEF: ['DEF']
    };

    const positions = positionPriority[player.position] || [];
    
    for (const pos of positions) {
      if (!lineup[pos]) {
        // For FLEX, ensure it's not a QB or DEF
        if (pos === 'FLEX' && !['RB', 'WR', 'TE'].includes(player.position)) {
          continue;
        }
        return pos;
      }
    }
    return null;
  };

  const aiAutoDraft = (aiId, pickIndex) => {
    // Double-check we're still on the right pick
    if (pickIndex !== currentDraftPick) return;
    
    const availablePlayers = playerPool.filter(p => !p.drafted);
    if (availablePlayers.length === 0) return;

    const aiLineup = aiLineups[aiId];
    const strategy = AIManagers.find(ai => ai.id === aiId)?.strategy;
    
    let selectedPlayer;
    
    // Fill positions in priority order
    const neededPositionsMap = {
      QB: !aiLineup.QB,
      RB1: !aiLineup.RB1,
      RB2: !aiLineup.RB2,
      WR1: !aiLineup.WR1,
      WR2: !aiLineup.WR2,
      TE: !aiLineup.TE,
      DEF: !aiLineup.DEF
    };

    const playersToConsider = availablePlayers.filter(p => {
        // Prioritize primary position slots first
        if (p.position === 'QB' && neededPositionsMap.QB) return true;
        if (p.position === 'RB' && (neededPositionsMap.RB1 || neededPositionsMap.RB2)) return true;
        if (p.position === 'WR' && (neededPositionsMap.WR1 || neededPositionsMap.WR2)) return true;
        if (p.position === 'TE' && neededPositionsMap.TE) return true;
        if (p.position === 'DEF' && neededPositionsMap.DEF) return true;
        return false;
    }).concat(availablePlayers.filter(p => {
        // Then consider FLEX if primary positions are filled or player fits FLEX
        return !findBestPosition(p, aiLineup) && findBestPosition(p, aiLineup) === 'FLEX' && (p.position === 'RB' || p.position === 'WR' || p.position === 'TE');
    }));

    const finalPlayersToConsider = playersToConsider.length > 0 ? playersToConsider : availablePlayers; // Fallback

    if (strategy === 'analytics') {
      // Pick highest projected points available from relevant players
      selectedPlayer = finalPlayersToConsider
        .sort((a, b) => b.projectedPoints - a.projectedPoints)[0];
    } else if (strategy === 'aggressive') {
      // Pick based on upside (elite tier preferred)
      const elitePlayers = finalPlayersToConsider.filter(p => p.tier === 'elite');
      selectedPlayer = elitePlayers.length > 0 ? 
        elitePlayers[Math.floor(Math.random() * elitePlayers.length)] :
        finalPlayersToConsider[Math.floor(Math.random() * Math.min(5, finalPlayersToConsider.length))];
    } else {
      // Conservative - pick safe, low injury risk players
      const safePlayers = finalPlayersToConsider.filter(p => p.injury_risk === 'low');
      selectedPlayer = safePlayers.length > 0 ?
        safePlayers[Math.floor(Math.random() * safePlayers.length)] :
        finalPlayersToConsider[Math.floor(Math.random() * finalPlayersToConsider.length)];
    }

    if (selectedPlayer) {
      addPlayerToLineup(selectedPlayer, false);
    }
  };

  const simulateWeek = () => {
    const events = [];
    const weekScores = {};
    
    // Calculate scores for each manager with more variance and strategy tips
    const myScore = calculateLineupScore(myLineup, events);
    weekScores['YOU'] = myScore;
    
    AIManagers.forEach(ai => {
      const aiScore = calculateLineupScore(aiLineups[ai.id], events, ai.strategy);
      weekScores[ai.name] = aiScore;
    });

    // Generate strategic events with detailed explanations
    if (Math.random() < simulationSettings.injuryChance / 100 || simulationSettings.forceInjury) {
      const eligiblePlayers = [
        ...Object.values(myLineup).filter(p => p),
        ...Object.values(aiLineups).flatMap(lineup => Object.values(lineup).filter(p => p))
      ];
      
      if (eligiblePlayers.length > 0) {
        const injuredPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
        const severity = Math.random() < 0.3 ? 'major' : 'minor';
        
        events.push({
          type: 'injury',
          icon: AlertTriangle,
          description: `${injuredPlayer.name} suffered a ${severity} injury`,
          player: injuredPlayer,
          impact: severity === 'major' ? 'Out 4-6 weeks' : 'Questionable for next week',
          strategy_note: severity === 'major' ? 
            'Time to hit the waiver wire hard. Look for handcuffs and high-upside replacements. Consider trading for depth if you have surplus at other positions.' :
            'Monitor practice reports closely. Have a backup plan ready. This could be a buy-low opportunity if other managers panic.',
          detailed_analysis: severity === 'major' ?
            `Major injuries like this can derail a season, but they also create opportunities. The injured player's backup likely just became a must-add. If you own the injured player, don't panic-trade for pennies. Sometimes injured stars return stronger in playoffs. Look at your league's IR spots and consider stashing if available.` :
            `Minor injuries are part of the game. Smart managers don't overreact to 'questionable' tags. Monitor beat reporters on Twitter, check practice participation Wednesday-Friday. Often these players still play and perform well. Use this as a negotiation tool if trading.`,
          actionable_steps: severity === 'major' ? 
            ['Check waiver wire for backup/handcuff', 'Review trade options for depth', 'Consider IR stashing', 'Look for schedule-based streamers'] :
            ['Monitor practice reports', 'Prepare backup options', 'Don\'t panic start alternatives yet', 'Use as trade leverage if needed']
        });
      }
    }

    if (Math.random() < simulationSettings.tradeFrequency / 100 || simulationSettings.forceTrade) {
      const trader1 = AIManagers[Math.floor(Math.random() * AIManagers.length)];
      const trader2 = AIManagers[Math.floor(Math.random() * AIManagers.length)];
      
      if (trader1.id !== trader2.id) {
        const tradeTypes = ['positional_need', 'buy_low_sell_high', 'handcuff_swap', 'playoff_preparation'];
        const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
        
        events.push({
          type: 'trade',
          icon: TrendingUp,
          description: `${trader1.name} traded with ${trader2.name}`,
          tradeType: tradeType,
          details: getTradeDetails(tradeType),
          strategy_note: getTradeStrategy(tradeType),
          detailed_analysis: getTradeAnalysis(tradeType),
          market_impact: 'This trade might shift positional values league-wide. Monitor if this creates new trade opportunities or affects waiver wire priorities.',
          actionable_steps: ['Analyze if this creates positional scarcity', 'Check if similar trades are now possible', 'Review your own roster needs', 'Consider if this affects playoff picture']
        });
      }
    }

    // Weather event
    if (Math.random() < 0.15 && simulationSettings.weatherImpact) {
      const weatherTypes = ['snow', 'rain', 'wind', 'dome'];
      const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      
      events.push({
        type: 'weather',
        icon: Activity,
        description: `Severe ${weather} conditions affecting multiple games`,
        impact: getWeatherImpact(weather),
        strategy_note: getWeatherStrategy(weather),
        detailed_analysis: `Weather is one of the most undervalued factors in fantasy football. Smart managers adjust their lineups based on conditions, not just player talent.`,
        actionable_steps: ['Check weather reports Friday/Saturday', 'Prioritize dome games in bad weather', 'Consider ground game in snow/rain', 'Avoid kickers in wind']
      });
    }

    setWeekEvents(events);
    
    // Update leaderboard with detailed tracking
    const newLeaderboard = leaderboard.map(entry => ({
      ...entry,
      points: entry.points + (weekScores[entry.manager] || 0),
      weeklyScores: [...(entry.weeklyScores || []), weekScores[entry.manager] || 0],
      record: updateRecord(entry.record, weekScores[entry.manager] || 0, weekScores)
    })).sort((a, b) => b.points - a.points);
    
    setLeaderboard(newLeaderboard);
    setCurrentWeek(prev => prev + 1);
  };

  const calculateLineupScore = (lineup, events, strategy = null) => {
    let total = 0;
    const lineupAnalysis = [];
    
    Object.entries(lineup).forEach(([position, player]) => {
      if (player) {
        // Base variance ±25%
        let variance = (Math.random() - 0.5) * 0.5;
        
        // Strategy-based adjustments
        if (strategy === 'aggressive') {
          // More volatile scores (higher ceiling, lower floor)
          variance *= 1.5;
        } else if (strategy === 'conservative') {
          // More consistent scores
          variance *= 0.7;
        }
        
        // Weather impact
        if (events.some(e => e.type === 'weather')) {
          const weatherEvent = events.find(e => e.type === 'weather');
          if (weatherEvent.description.includes('snow') || weatherEvent.description.includes('rain')) {
            if (player.position === 'RB') variance += 0.1; // RBs benefit
            if (player.position === 'WR') variance -= 0.15; // WRs suffer
          }
        }
        
        const playerScore = Math.max(0, player.projectedPoints * (1 + variance));
        total += playerScore;
        
        lineupAnalysis.push({
          player: player.name,
          position,
          projected: player.projectedPoints,
          actual: playerScore,
          variance: variance > 0 ? 'outperformed' : 'underperformed'
        });
      }
    });
    
    return Math.round(total * 10) / 10;
  };

  const getTradeDetails = (tradeType) => {
    const details = {
      positional_need: 'RB1 for WR1 swap to fill roster holes',
      buy_low_sell_high: 'Acquired underperforming star for consistent role player',
      handcuff_swap: 'Exchanged backup RBs to handcuff own starters', 
      playoff_preparation: 'Traded for players with better playoff schedules'
    };
    return details[tradeType] || 'Player swap';
  };

  const getTradeStrategy = (tradeType) => {
    const strategies = {
      positional_need: 'Address roster construction imbalances. Sometimes you need to trade strength for weakness even if you "lose" on paper.',
      buy_low_sell_high: 'Classic strategy - buy struggling stars, sell overperforming role players. Requires patience and conviction.',
      handcuff_swap: 'Reduce risk by owning your starter\'s backup. Especially valuable for injury-prone or workload-heavy players.',
      playoff_preparation: 'Think ahead to weeks 15-17. A player\'s schedule matters more than current form for championship runs.'
    };
    return strategies[tradeType];
  };

  const getTradeAnalysis = (tradeType) => {
    const analysis = {
      positional_need: 'Positional need trades are often the most mutually beneficial. Both teams get stronger at their weakest position. Don\'t get caught up in "winning" every trade - sometimes filling a hole is worth overpaying slightly.',
      buy_low_sell_high: 'This is where fantasy championships are won. The key is identifying why a player is struggling: Is it bad luck, poor matchups, or declining skill? Buy the first two, avoid the third.',
      handcuff_swap: 'Handcuff swaps are underutilized. They provide insurance without roster cost. Target handcuffs for your most valuable/injury-prone players.',
      playoff_preparation: 'Playoff schedule analysis separates good managers from great ones. A player with brutal weeks 15-17 matchups should be traded by week 10, regardless of talent.'
    };
    return analysis[tradeType];
  };

  const getWeatherImpact = (weather) => {
    const impacts = {
      snow: 'Passing games limited, running games emphasized. Kicker accuracy suffers.',
      rain: 'Ball security issues, reduced passing volume. Field goals become harder.',
      wind: 'Passing accuracy down, especially deep balls. Kicking severely impacted.',
      dome: 'Perfect conditions - passing games and kicking unaffected.'
    };
    return impacts[weather];
  };

  const getWeatherStrategy = (weather) => {
    const strategies = {
      snow: 'Start RBs over WRs when possible. Avoid kickers. Look for slot receivers who get short targets.',
      rain: 'Similar to snow but less severe. RBs still preferred, avoid deep-ball receivers.',
      wind: 'Avoid all kickers if possible. Start possession receivers over deep threats. RBs benefit from increased usage.',
      dome: 'Perfect conditions for passing games. Great spot for kickers and passing game stacks.'
    };
    return strategies[weather];
  };

  const updateRecord = (currentRecord, myScore, allScores) => {
    const [wins, losses] = currentRecord.split('-').map(Number);
    const scores = Object.values(allScores).sort((a, b) => b - a);
    const myRank = scores.indexOf(myScore) + 1;
    
    // Win if in top half, loss if in bottom half
    if (myRank <= scores.length / 2) {
      return `${wins + 1}-${losses}`;
    } else {
      return `${wins}-${losses + 1}`;
    }
  };

  const getCurrentDraftManager = () => {
    if (gamePhase !== 'draft' || draftPhase !== 'in_progress' || draftOrder.length === 0) return null;
    
    const managerIndex = draftOrder[currentDraftPick];
    if (managerIndex === 0) return "YOUR PICK";
    
    const aiManager = AIManagers.find(ai => ai.id === managerIndex);
    return aiManager ? `${aiManager.name}'S PICK` : "UNKNOWN";
  };

  const getPositionSlots = () => {
    return [
      { key: 'QB', name: 'Quarterback', limit: 1 },
      { key: 'RB1', name: 'Running Back 1', limit: 1, position: 'RB' },
      { key: 'RB2', name: 'Running Back 2', limit: 1, position: 'RB' },
      { key: 'WR1', name: 'Wide Receiver 1', limit: 1, position: 'WR' },
      { key: 'WR2', name: 'Wide Receiver 2', limit: 1, position: 'WR' },
      { key: 'TE', name: 'Tight End', limit: 1 },
      { key: 'FLEX', name: 'Flex (RB/WR/TE)', limit: 1, position: 'FLEX' },
      { key: 'DEF', name: 'Defense/Special Teams', limit: 1 }
    ];
  };

  // Start AI drafting immediately if first pick isn't user
  useEffect(() => {
    if (gamePhase === 'draft' && draftPhase === 'in_progress' && draftOrder.length > 0) {
      const currentManager = draftOrder[currentDraftPick];
      if (currentManager !== 0) {
        const timer = setTimeout(() => {
          aiAutoDraft(currentManager, currentDraftPick);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gamePhase, draftPhase, currentDraftPick, draftOrder, aiLineups, playerPool]); // Added aiLineups and playerPool for safety, though they shouldn't trigger too often


  // Quick Sim Components
  const renderQuickSim = () => (
    <div className="space-y-6">
      <div className="neo-brutal-card bg-white p-6 transform -rotate-1">
        <h2 className="text-2xl font-black mb-6">QUICK SIMULATIONS</h2>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {quickScenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setActiveScenario(scenario)}
              className="scenario-card p-6 bg-blue-100 hover:bg-blue-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <h3 className="text-xl font-black">{scenario.title}</h3>
              </div>
              <p className="font-bold text-gray-700">{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
          
          .scenario-card {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
            cursor: pointer;
          }
          
          .scenario-card:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }
          
          .player-card {
            border: 3px solid #000000;
            box-shadow: 3px 3px 0px #000000;
            transition: all 0.1s ease;
            cursor: pointer;
          }
          
          .player-card:hover {
            transform: translate(-1px, -1px);
            box-shadow: 4px 4px 0px #000000;
          }
          
          .player-card.drafted {
            opacity: 0.5;
            background-color: #f5f5f5;
            cursor: not-allowed;
          }
          
          .player-card.selected {
            background-color: #FFE066;
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0px #000000;
          }
          
          .lineup-slot {
            border: 3px dashed #000000;
            background: #f0f0f0;
            min-height: 80px;
          }
          
          .lineup-slot.filled {
            border: 3px solid #000000;
            background: #ffffff;
          }
          
          .event-item {
            border: 2px solid #000000;
            cursor: pointer;
            transition: all 0.1s ease;
          }
          
          .event-item:hover {
            background: #f0f0f0;
            transform: translate(-1px, -1px);
            box-shadow: 3px 3px 0px #000000;
          }

          .draft-pick-indicator {
            border: 4px solid #FF6600;
            box-shadow: 6px 6px 0px #FF6600;
            background: #FFE066;
          }
        `}
      </style>

      <TooltipProvider>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-black mb-2 transform rotate-1">
              FANTASY SIMULATOR
            </h1>
            <p className="text-xl font-bold text-gray-600">
              Practice your fantasy football skills in realistic scenarios
            </p>
          </div>

          {/* Mode Selection */}
          <div className="neo-brutal-card bg-white p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-black">CHOOSE SIMULATION TYPE</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                onClick={() => setActiveMode('quick')}
                className={`scenario-card p-6 cursor-pointer ${activeMode === 'quick' ? 'bg-blue-200' : 'bg-blue-100 hover:bg-blue-150'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8" />
                  <h3 className="text-xl font-black">QUICK SCENARIOS</h3>
                </div>
                <p className="font-bold text-gray-700">Practice specific fantasy decisions in 5-10 minutes</p>
              </div>

              <div 
                onClick={startFullSim}
                className={`scenario-card p-6 cursor-pointer ${activeMode === 'full' ? 'bg-green-200' : 'bg-green-100 hover:bg-green-150'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8" />
                  <h3 className="text-xl font-black">FULL SEASON SIM</h3>
                </div>
                <p className="font-bold text-gray-700">Complete fantasy football experience with AI opponents</p>
              </div>
            </div>
          </div>

          {/* Quick Sim Mode */}
          {activeMode === 'quick' && !activeScenario && renderQuickSim()}

          {/* Full Simulation Mode */}
          {activeMode === 'full' && (
            <div className="space-y-6">
              {/* Draft Phase */}
              {gamePhase === 'draft' && (
                <div className="neo-brutal-card bg-yellow-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black">DRAFT IN PROGRESS</h2>
                      <p className="font-bold">Snake Draft • 8 Rounds • 4 Teams</p>
                    </div>
                    <div className="draft-pick-indicator p-4 text-center">
                      <div className="font-black text-lg">PICK {currentDraftPick + 1}</div>
                      <div className="font-bold">{getCurrentDraftManager()}</div>
                    </div>
                  </div>

                  {/* Draft Order Visualization */}
                  <div className="grid grid-cols-8 gap-2 mb-6">
                    {draftOrder.map((managerId, index) => (
                      <div
                        key={index}
                        className={`p-2 border-2 border-black text-center text-xs font-black ${
                          index === currentDraftPick ? 'bg-orange-400' : 
                          index < currentDraftPick ? 'bg-gray-300' : 'bg-white'
                        }`}
                      >
                        {index + 1}:{' '}
                        {managerId === 0 ? 'YOU' : AIManagers.find(ai => ai.id === managerId)?.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation Controls */}
              {gamePhase === 'playing' && (
                <div className="neo-brutal-card bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6" />
                      <h2 className="text-2xl font-black">WEEK {currentWeek} SIMULATION</h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setShowAdvancedControls(true)}
                        className="neo-brutal-button bg-gray-500 hover:bg-gray-600 text-white font-black"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        CONTROLS
                      </Button>
                      
                      <Button
                        onClick={simulateWeek}
                        className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        SIMULATE WEEK
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Leaderboard with Weekly Scores */}
                  <div className="neo-brutal-card bg-yellow-100 p-4 mb-6">
                    <h3 className="text-lg font-black mb-3">CURRENT STANDINGS</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      {leaderboard.map((entry, index) => (
                        <Tooltip key={entry.manager}>
                          <TooltipTrigger>
                            <div className={`p-3 border-2 border-black ${index === 0 ? 'bg-yellow-300' : 'bg-white'}`}>
                              <div className="font-black text-sm">{entry.manager}</div>
                              <div className="font-bold">{entry.points.toFixed(1)} pts</div>
                              <div className="font-bold text-xs text-gray-600">{entry.record}</div>
                              {entry.weeklyScores && entry.weeklyScores.length > 0 && (
                                <div className="text-xs font-bold text-green-600">
                                  Last: {entry.weeklyScores[entry.weeklyScores.length - 1]?.toFixed(1)}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p><strong>Weekly Scores:</strong></p>
                              {entry.weeklyScores?.map((score, i) => (
                                <p key={i}>Week {i + 1}: {score.toFixed(1)} pts</p>
                              )) || <p>No games played yet</p>}
                              <p><strong>Strategy:</strong> {
                                entry.manager === 'YOU' ? 'Your decisions' :
                                entry.manager === 'THE ANALYZER' ? 'Data-driven, consistent' :
                                entry.manager === 'TRADE MASTER' ? 'Aggressive trading, high risk/reward' :
                                'Conservative, safe plays'
                              }</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Your Lineup */}
                <div className="lg:col-span-2">
                  <div className="neo-brutal-card bg-white p-6">
                    <h3 className="text-xl font-black mb-4">
                      {gamePhase === 'draft' ? 'YOUR DRAFT' : 'YOUR LINEUP'}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {getPositionSlots().map(slot => (
                        <div key={slot.key} className={`lineup-slot p-4 rounded ${myLineup[slot.key] ? 'filled' : ''}`}>
                          <div className="font-black text-sm mb-2">{slot.name}</div>
                          {myLineup[slot.key] ? (
                            <div>
                              <div className="font-black">{myLineup[slot.key].name}</div>
                              <div className="font-bold text-sm text-gray-600">
                                {myLineup[slot.key].team} • {myLineup[slot.key].projectedPoints} pts
                              </div>
                              <Badge className={`text-xs mt-1 ${
                                myLineup[slot.key].tier === 'elite' ? 'bg-green-500' :
                                myLineup[slot.key].tier === 'mid' ? 'bg-yellow-500' : 'bg-gray-500'
                              } text-white`}>
                                {myLineup[slot.key].tier}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <div className="font-bold text-gray-500">
                                {gamePhase === 'draft' ? 'Waiting for draft' : 'Empty slot'}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Player Pool - Only show during draft */}
                    {gamePhase === 'draft' && (
                      <div className="mb-4">
                        <h4 className="font-black mb-3">AVAILABLE PLAYERS</h4>
                        <div className="max-h-96 overflow-y-auto space-y-2">
                          {playerPool.filter(p => !p.drafted).map(player => (
                            <Tooltip key={player.id}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`player-card p-3 bg-gray-50 cursor-pointer ${
                                    draftOrder[currentDraftPick] !== 0 ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  onClick={() => {
                                    if (draftOrder[currentDraftPick] === 0) {
                                      addPlayerToLineup(player, true);
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-black">{player.name}</div>
                                      <div className="font-bold text-sm text-gray-600">
                                        {player.position} - {player.team}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-black">{player.projectedPoints} pts</div>
                                      <Badge className={`text-xs ${
                                        player.tier === 'elite' ? 'bg-green-500' :
                                        player.tier === 'mid' ? 'bg-yellow-500' : 'bg-gray-500'
                                      } text-white`}>
                                        {player.tier}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                  <p><strong>Projected:</strong> {player.projectedPoints} pts/week</p>
                                  <p><strong>Injury Risk:</strong> {player.injury_risk}</p>
                                  <p><strong>Strategy Note:</strong> {
                                    player.tier === 'elite' ? 'Must-draft talent with league-winning upside. These players separate good teams from great ones.' :
                                    player.tier === 'mid' ? 'Solid weekly starter with decent floor. Good for consistent production and depth.' :
                                    'Bench depth or streaming option. Valuable for bye weeks and injury coverage.'
                                  }</p>
                                  {player.position === 'DEF' && (
                                    <p><strong>Defense Tip:</strong> Stream defenses based on matchups rather than drafting early. Target teams playing backup QBs.</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Events & AI Activity */}
                <div className="space-y-6">
                  {/* Enhanced Week Events with Detailed Tooltips */}
                  <div className="neo-brutal-card bg-blue-100 p-6">
                    <h3 className="text-lg font-black mb-4">THIS WEEK'S EVENTS</h3>
                    {weekEvents.length === 0 ? (
                      <div className="text-center py-4">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-bold text-gray-600">No events yet</p>
                        <p className="font-bold text-sm text-gray-500">Simulate week to see what happens!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {weekEvents.map((event, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div className={`event-item p-3 rounded ${
                                event.type === 'injury' ? 'bg-red-100 border-red-500' :
                                event.type === 'trade' ? 'bg-green-100 border-green-500' :
                                event.type === 'weather' ? 'bg-yellow-100 border-yellow-500' :
                                'bg-blue-100 border-blue-500'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <event.icon className="w-4 h-4" />
                                  <span className="font-bold text-sm">{event.description}</span>
                                </div>
                                {event.impact && (
                                  <div className="mt-1 text-xs font-bold text-gray-600">
                                    Impact: {event.impact}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md p-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-black text-sm mb-1">IMMEDIATE STRATEGY</h4>
                                  <p className="text-xs">{event.strategy_note}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-black text-sm mb-1">DETAILED ANALYSIS</h4>
                                  <p className="text-xs">{event.detailed_analysis}</p>
                                </div>

                                {event.actionable_steps && (
                                  <div>
                                    <h4 className="font-black text-sm mb-1">ACTION ITEMS</h4>
                                    <ul className="text-xs space-y-1">
                                      {event.actionable_steps.map((step, i) => (
                                        <li key={i}>• {step}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {event.market_impact && (
                                  <div>
                                    <h4 className="font-black text-sm mb-1">MARKET IMPACT</h4>
                                    <p className="text-xs">{event.market_impact}</p>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Manager Info with Enhanced Tooltips */}
                  <div className="neo-brutal-card bg-purple-100 p-6">
                    <h3 className="text-lg font-black mb-4">AI OPPONENTS</h3>
                    <div className="space-y-3">
                      {AIManagers.map(ai => (
                        <Tooltip key={ai.id}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-3 p-2 bg-white border-2 border-black rounded cursor-pointer hover:bg-gray-50">
                              <span className="text-2xl">{ai.avatar}</span>
                              <div className="flex-1">
                                <div className="font-black text-sm">{ai.name}</div>
                                <div className="font-bold text-xs text-gray-600">
                                  {leaderboard.find(l => l.manager === ai.name)?.record || '0-0'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-sm">
                                  {leaderboard.find(l => l.manager === ai.name)?.points.toFixed(1) || '0.0'}
                                </div>
                                <div className="font-bold text-xs text-gray-500">pts</div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <div>
                                <p><strong>Strategy:</strong> {ai.strategy}</p>
                                <p><strong>Tendencies:</strong> {
                                  ai.strategy === 'analytics' ? 'Makes data-driven decisions, values consistency over upside, rarely makes emotional moves' :
                                  ai.strategy === 'aggressive' ? 'Takes big risks for big rewards, active trader, chases breakout players' :
                                  'Risk-averse, prefers proven players, makes safe decisions'
                                }</p>
                              </div>
                              
                              {gamePhase === 'playing' && (
                                <div>
                                  <p><strong>Current Lineup Strength:</strong></p>
                                  {Object.entries(aiLineups[ai.id] || {}).map(([pos, player]) => (
                                    <p key={pos} className="text-xs">
                                      {pos}: {player ? `${player.name} (${player.projectedPoints}pts)` : 'Empty'}
                                    </p>
                                  ))}
                                </div>
                              )}
                              
                              <div>
                                <p><strong>Trade Likelihood:</strong> {
                                  ai.strategy === 'aggressive' ? 'High - Always looking for upgrades' :
                                  ai.strategy === 'analytics' ? 'Medium - Will trade if the data supports it' :
                                  'Low - Prefers to stick with drafted players'
                                }</p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Controls Dialog - Enhanced */}
          <Dialog open={showAdvancedControls} onOpenChange={setShowAdvancedControls}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">ADVANCED SIMULATION CONTROLS</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">INJURY PROBABILITY</h3>
                      <p className="font-bold text-sm text-gray-600">Chance of injury events per week (%)</p>
                    </div>
                    <div className="w-32">
                      <Slider
                        value={[simulationSettings.injuryChance]}
                        onValueChange={(value) => setSimulationSettings({...simulationSettings, injuryChance: value[0]})}
                        max={50}
                        step={5}
                      />
                      <span className="font-black text-sm">{simulationSettings.injuryChance}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">TRADE FREQUENCY</h3>
                      <p className="font-bold text-sm text-gray-600">How often AI managers trade (%)</p>
                    </div>
                    <div className="w-32">
                      <Slider
                        value={[simulationSettings.tradeFrequency]}
                        onValueChange={(value) => setSimulationSettings({...simulationSettings, tradeFrequency: value[0]})}
                        max={100}
                        step={10}
                      />
                      <span className="font-black text-sm">{simulationSettings.tradeFrequency}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">WEATHER IMPACT</h3>
                      <p className="font-bold text-sm text-gray-600">Include weather in player performance</p>
                    </div>
                    <Switch
                      checked={simulationSettings.weatherImpact}
                      onCheckedChange={(checked) => setSimulationSettings({...simulationSettings, weatherImpact: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">FORCE TRADE EVENT</h3>
                      <p className="font-bold text-sm text-gray-600">Guarantee a trade happens this week</p>
                    </div>
                    <Switch
                      checked={simulationSettings.forceTrade}
                      onCheckedChange={(checked) => setSimulationSettings({...simulationSettings, forceTrade: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">FORCE INJURY EVENT</h3>
                      <p className="font-bold text-sm text-gray-600">Guarantee an injury happens this week</p>
                    </div>
                    <Switch
                      checked={simulationSettings.forceInjury}
                      onCheckedChange={(checked) => setSimulationSettings({...simulationSettings, forceInjury: checked})}
                    />
                  </div>
                </div>

                <div className="neo-brutal-card bg-yellow-100 p-4">
                  <h4 className="font-black mb-2">SIMULATION TIPS</h4>
                  <ul className="text-sm font-bold space-y-1">
                    <li>• Use injury events to practice waiver wire strategy</li>
                    <li>• Force trades to see how market moves affect your team</li>
                    <li>• Weather events teach situational lineup decisions</li>
                    <li>• Higher trade frequency creates more dynamic leagues</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowAdvancedControls(false)}
                    className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                  >
                    APPLY SETTINGS
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </div>
  );
}
