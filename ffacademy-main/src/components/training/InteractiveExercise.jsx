import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Calculator, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  X,
  Info,
  Zap,
  RefreshCw
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

// Mock player data for exercises
const mockPlayers = {
  qbs: [
    { name: "Josh Allen", team: "BUF", projectedPoints: 24.8, passingYds: 275, passingTDs: 2, rushingYds: 45, rushingTDs: 1, interceptions: 1 },
    { name: "Lamar Jackson", team: "BAL", projectedPoints: 23.2, passingYds: 240, passingTDs: 2, rushingYds: 65, rushingTDs: 1, interceptions: 0 },
    { name: "Dak Prescott", team: "DAL", projectedPoints: 19.4, passingYds: 290, passingTDs: 2, rushingYds: 15, rushingTDs: 0, interceptions: 1 }
  ],
  rbs: [
    { name: "Alvin Kamara", team: "NO", projectedPoints: 16.2, rushingYds: 85, rushingTDs: 1, receptions: 6, receivingYds: 45, receivingTDs: 0 },
    { name: "Derrick Henry", team: "BAL", projectedPoints: 15.8, rushingYds: 95, rushingTDs: 1, receptions: 2, receivingYds: 15, receivingTDs: 0 },
    { name: "Christian McCaffrey", team: "SF", projectedPoints: 18.2, rushingYds: 70, rushingTDs: 0, receptions: 8, receivingYds: 65, receivingTDs: 1 }
  ],
  wrs: [
    { name: "Tyreek Hill", team: "MIA", projectedPoints: 16.4, receptions: 7, receivingYds: 95, receivingTDs: 1, targets: 10 },
    { name: "Cooper Kupp", team: "LAR", projectedPoints: 15.2, receptions: 8, receivingYds: 85, receivingTDs: 1, targets: 11 },
    { name: "CeeDee Lamb", team: "DAL", projectedPoints: 17.8, receptions: 6, receivingYds: 110, receivingTDs: 1, targets: 9 }
  ]
};

export default function InteractiveExercise({ element, moduleTitle }) {
  // All state at component level
  const [exerciseState, setExerciseState] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Scoring Calculator states
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('Standard');
  const [calculatedPoints, setCalculatedPoints] = useState(null);
  
  // Scoring System Calculator states
  const [scoringFormat, setScoringFormat] = useState('standard');
  const [scoringPoints, setScoringPoints] = useState(null);
  
  // Draft Simulator states
  const [draftPosition, setDraftPosition] = useState(null);
  const [draftSelectedPlayer, setDraftSelectedPlayer] = useState(null);
  const [draftResults, setDraftResults] = useState(null);
  
  // Quiz states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // FAAB Simulator states
  const [bidAmount, setBidAmount] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [bidResult, setBidResult] = useState(null);
  
  // Roster Builder states
  const [selectedLineupPlayers, setSelectedLineupPlayers] = useState({});
  const [isLineupComplete, setIsLineupComplete] = useState(false);

  const resetExercise = () => {
    setExerciseState({});
    setShowFeedback(false);
    setSelectedAnswers({});
    setCompletedSteps([]);
    setSelectedPlayer(null);
    setCalculatedPoints(null);
    setDraftPosition(null);
    setDraftSelectedPlayer(null);
    setDraftResults(null);
    setCurrentQuestion(0);
    setQuizSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
    setBidAmount('');
    setShowResult(false);
    setBidResult(null);
    setSelectedLineupPlayers({});
    setIsLineupComplete(false);
  };

  const handleAction = (actionType, data, stepId) => {
    setExerciseState(prev => ({
      ...prev,
      [stepId]: data
    }));

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }

    setShowFeedback(true);
  };

  const calculateFantasyPoints = (player, format) => {
    let points = 0;
    
    if (player.passingYds) {
      points += Math.floor(player.passingYds / 25);
      points += player.passingTDs * 4;
      points -= player.interceptions * 2;
    }
    
    if (player.rushingYds) {
      points += Math.floor(player.rushingYds / 10);
      points += player.rushingTDs * 6;
    }
    
    if (player.receivingYds) {
      points += Math.floor(player.receivingYds / 10);
      points += player.receivingTDs * 6;
      
      if (format === 'PPR') {
        points += player.receptions;
      } else if (format === 'Half-PPR') {
        points += player.receptions * 0.5;
      }
    }
    
    return Math.round(points * 10) / 10;
  };

  const getDraftAnalysis = (position, player) => {
    const analyses = {
      1: {
        "Christian McCaffrey": {
          strengths: ["Elite dual-threat capability", "Proven track record", "Positional advantage at RB"],
          nextRounds: ["Target WR1 in round 2", "Look for QB value later", "Build RB depth in middle rounds"],
          proTip: "CMC gives you a massive positional advantage. Focus on building around him with consistent WRs."
        },
        "Derrick Henry": {
          strengths: ["Goal-line dominance", "High TD upside", "Proven workhorse"],
          nextRounds: ["Prioritize pass-catching RB2", "Target reliable WR1", "Consider handcuff later"],
          proTip: "Henry's age requires building RB depth early. His TD upside is unmatched but have a backup plan."
        }
      },
      6: {
        "Tyreek Hill": {
          strengths: ["Elite speed and big-play ability", "High target share", "Consistent WR1 production"],
          nextRounds: ["Target RB with next pick", "Build RB depth early", "Look for complementary WR later"],
          proTip: "Going WR first means you must prioritize RB in rounds 2-3. Hill's ceiling makes it worthwhile."
        },
        "Josh Jacobs": {
          strengths: ["Bellcow role", "Goal-line work", "Proven production"],
          nextRounds: ["Target elite WR in round 2", "Build WR depth", "Consider RB handcuff"],
          proTip: "Jacobs gives you RB security. Use your next picks to build elite WR corps while others chase RBs."
        }
      },
      12: {
        "CeeDee Lamb": {
          strengths: ["Target monster", "Red zone presence", "Dak connection"],
          nextRounds: ["RB-RB strategy viable", "Target another WR1", "QB can wait"],
          proTip: "Late picks allow back-to-back selections. Consider pairing Lamb with another elite WR or going RB heavy."
        },
        "Travis Kelce": {
          strengths: ["Massive positional advantage", "Consistent target share", "Proven playoff performer"],
          nextRounds: ["Target best available RB/WR", "Build skill position depth", "TE position solved"],
          proTip: "Kelce eliminates TE concerns entirely. Focus on building the best RB/WR corps possible."
        }
      }
    };

    return analyses[position]?.[player] || {
      strengths: ["Good value at this position"],
      nextRounds: ["Build around your pick"],
      proTip: "Trust your instincts and build depth."
    };
  };

  // Render functions without hooks
  const renderScoringCalculatorContent = () => {
    const allPlayers = [...mockPlayers.qbs, ...mockPlayers.rbs, ...mockPlayers.wrs];

    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-black mb-2">SCORING SYSTEM CALCULATOR</h4>
            <p className="font-bold text-gray-700">See how different scoring formats affect player values</p>
          </div>

          <motion.div 
            className="neo-brutal-card bg-white p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h5 className="font-black mb-3">STEP 1: CHOOSE A PLAYER</h5>
            <div className="grid md:grid-cols-3 gap-3">
              {allPlayers.map((player, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`p-3 border-3 border-black cursor-pointer transition-all ${
                        selectedPlayer?.name === player.name ? 'bg-yellow-300' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedPlayer(player)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-black text-sm">{player.name}</div>
                      <div className="font-bold text-xs text-gray-600">{player.team}</div>
                      <div className="font-bold text-xs text-blue-600">Proj: {player.projectedPoints}</div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1 text-xs">
                      <p><strong>Projected Stats:</strong></p>
                      {player.passingYds && <p>Passing: {player.passingYds} yds, {player.passingTDs} TDs, {player.interceptions} INTs</p>}
                      {player.rushingYds && <p>Rushing: {player.rushingYds} yds, {player.rushingTDs} TDs</p>}
                      {player.receivingYds && <p>Receiving: {player.receptions} rec, {player.receivingYds} yds, {player.receivingTDs} TDs</p>}
                      <p className="text-yellow-600"><strong>Click to select this player</strong></p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </motion.div>

          {selectedPlayer && (
            <motion.div 
              className="neo-brutal-card bg-white p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h5 className="font-black mb-3">STEP 2: CHOOSE SCORING FORMAT</h5>
              <div className="grid md:grid-cols-3 gap-3">
                {['Standard', 'PPR', 'Half-PPR'].map(format => (
                  <Tooltip key={format}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`p-3 border-3 border-black cursor-pointer transition-all ${
                          selectedFormat === format ? 'bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedFormat(format)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-black text-sm">{format}</div>
                        <div className="font-bold text-xs text-gray-600">
                          {format === 'Standard' ? 'No reception bonus' : 
                           format === 'PPR' ? '1 pt per reception' : '0.5 pts per reception'}
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1 text-xs">
                        <p><strong>{format} Scoring:</strong></p>
                        <p>• 1 pt per 25 pass yards, 4 pts per pass TD</p>
                        <p>• 1 pt per 10 rush/rec yards, 6 pts per TD</p>
                        {format === 'PPR' && <p>• 1 pt per reception (boosts WRs/pass-catching RBs)</p>}
                        {format === 'Half-PPR' && <p>• 0.5 pts per reception (balanced approach)</p>}
                        {format === 'Standard' && <p>• No reception bonus (favors TD-dependent players)</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          )}

          {selectedPlayer && selectedFormat && (
            <motion.div 
              className="neo-brutal-card bg-green-100 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-black">STEP 3: SEE THE IMPACT</h5>
                <Button
                  onClick={() => {
                    const points = calculateFantasyPoints(selectedPlayer, selectedFormat);
                    setCalculatedPoints(points);
                    handleAction('calculate', { player: selectedPlayer.name, format: selectedFormat, points }, 'scoring_calc');
                  }}
                  className="neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  CALCULATE POINTS
                </Button>
              </div>

              {calculatedPoints !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center p-4 bg-yellow-300 border-3 border-black"
                >
                  <div className="text-3xl font-black text-orange-600 mb-2">{calculatedPoints} POINTS</div>
                  <div className="font-bold">{selectedPlayer.name} in {selectedFormat} Scoring</div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    {['Standard', 'PPR', 'Half-PPR'].map(format => {
                      const points = calculateFantasyPoints(selectedPlayer, format);
                      return (
                        <div key={format} className={`p-2 border-2 border-black ${format === selectedFormat ? 'bg-white' : 'bg-gray-200'}`}>
                          <div className="font-black">{format}</div>
                          <div className="font-bold">{points} pts</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-100 border-2 border-black">
                    <div className="font-black text-sm">💡 KEY INSIGHT</div>
                    <div className="font-bold text-xs">
                      {selectedPlayer.receptions > 5 ? 
                        `${selectedPlayer.name} benefits significantly from PPR scoring due to high reception volume!` :
                        `${selectedPlayer.name} performs similarly across formats - not reception-dependent.`
                      }
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    );
  };

  const renderDraftSimulatorContent = () => {
    const draftPositions = [
      { pos: 1, description: "Early Pick", strategy: "Target elite RBs", players: ["Christian McCaffrey", "Derrick Henry", "Saquon Barkley"] },
      { pos: 6, description: "Middle Pick", strategy: "Most flexible", players: ["Tyreek Hill", "Davante Adams", "Josh Jacobs"] },
      { pos: 12, description: "Late Pick", strategy: "Back-to-back picks", players: ["CeeDee Lamb", "Cooper Kupp", "Travis Kelce"] }
    ];

    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-black mb-2">DRAFT STRATEGY SIMULATOR</h4>
            <p className="font-bold text-gray-700">Learn how draft position affects your strategy</p>
          </div>

          <motion.div 
            className="neo-brutal-card bg-white p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h5 className="font-black mb-3">STEP 1: SELECT YOUR DRAFT POSITION</h5>
            <div className="grid md:grid-cols-3 gap-4">
              {draftPositions.map(position => (
                <Tooltip key={position.pos}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`p-4 border-3 border-black cursor-pointer ${
                        draftPosition?.pos === position.pos ? 'bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setDraftPosition(position)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-600">#{position.pos}</div>
                        <div className="font-black text-sm">{position.description}</div>
                        <div className="font-bold text-xs text-gray-600">{position.strategy}</div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p><strong>Draft Position #{position.pos} Strategy:</strong></p>
                      <p>{position.strategy}</p>
                      <p><strong>Typical Available Players:</strong></p>
                      <ul className="text-xs">
                        {position.players.map(player => <li key={player}>• {player}</li>)}
                      </ul>
                      <p className="text-yellow-600"><strong>Click to practice this position</strong></p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </motion.div>

          {draftPosition && (
            <motion.div 
              className="neo-brutal-card bg-white p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h5 className="font-black mb-3">STEP 2: MAKE YOUR FIRST ROUND PICK</h5>
              <div className="grid md:grid-cols-3 gap-3">
                {draftPosition.players.map(playerName => (
                  <Tooltip key={playerName}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`p-3 border-3 border-black cursor-pointer ${
                          draftSelectedPlayer === playerName ? 'bg-yellow-300' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setDraftSelectedPlayer(playerName)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-black text-sm">{playerName}</div>
                        <div className="font-bold text-xs text-gray-600">Round 1 Pick</div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p><strong>Selecting {playerName}</strong></p>
                      <p>This choice will influence your entire draft strategy</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          )}

          {draftPosition && draftSelectedPlayer && (
            <motion.div 
              className="neo-brutal-card bg-green-100 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-black">STEP 3: ANALYZE YOUR CHOICE</h5>
                <Button
                  onClick={() => {
                    const analysis = {
                      position: draftPosition.pos,
                      player: draftSelectedPlayer,
                      strategy: getDraftAnalysis(draftPosition.pos, draftSelectedPlayer)
                    };
                    setDraftResults(analysis);
                    handleAction('draft_pick', analysis, 'draft_sim');
                  }}
                  className="neo-brutal-button bg-purple-500 hover:bg-purple-600 text-white font-black"
                >
                  <Target className="w-4 h-4 mr-2" />
                  ANALYZE PICK
                </Button>
              </div>

              {draftResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-white border-3 border-black">
                    <h6 className="font-black text-lg mb-2">📊 DRAFT ANALYSIS</h6>
                    <div className="font-bold text-sm mb-3">
                      Pick #{draftResults.position}: {draftResults.player}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-100 border-2 border-black">
                        <h6 className="font-black text-sm text-green-800">STRENGTHS</h6>
                        <ul className="text-xs font-bold mt-1">
                          {draftResults.strategy.strengths.map((strength, i) => (
                            <li key={i}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-yellow-100 border-2 border-black">
                        <h6 className="font-black text-sm text-yellow-800">NEXT ROUND FOCUS</h6>
                        <ul className="text-xs font-bold mt-1">
                          {draftResults.strategy.nextRounds.map((focus, i) => (
                            <li key={i}>• {focus}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-100 border-2 border-black">
                      <div className="font-black text-sm text-blue-800">💡 PRO TIP</div>
                      <div className="font-bold text-xs mt-1">{draftResults.strategy.proTip}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    );
  };

  const renderQuizContent = () => {
    const questions = element.questions || [];
    if (questions.length === 0) return null;

    const handleAnswer = (answerIndex) => {
      setQuizSelectedAnswer(answerIndex);
      setShowExplanation(true);
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(prev => prev + 1);
      }
    };

    const nextQuestion = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setQuizSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setCompleted(true);
      }
    };

    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-black mb-2">KNOWLEDGE CHECK</h4>
            <p className="font-bold text-gray-700">Question {currentQuestion + 1} of {questions.length}</p>
          </div>

          {!completed ? (
            <>
              <motion.div 
                className="neo-brutal-card bg-white p-6"
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h5 className="font-black text-lg mb-4">{questions[currentQuestion].question}</h5>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      className={`p-3 border-3 border-black cursor-pointer transition-all ${
                        quizSelectedAnswer === index ? 
                          (index === questions[currentQuestion].correct ? 'bg-green-300' : 'bg-red-300') :
                          'bg-gray-100 hover:bg-gray-200'
                      } ${showExplanation && index === questions[currentQuestion].correct ? 'bg-green-300' : ''}`}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                      whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-black text-sm">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-bold">{option}</span>
                        {showExplanation && index === questions[currentQuestion].correct && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                        )}
                        {showExplanation && quizSelectedAnswer === index && index !== questions[currentQuestion].correct && (
                          <X className="w-5 h-5 text-red-600 ml-auto" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-100 border-3 border-black"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-black text-sm text-blue-800">EXPLANATION</div>
                        <div className="font-bold text-sm">{questions[currentQuestion].explanation}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showExplanation && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={nextQuestion}
                      className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black"
                    >
                      {currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'VIEW RESULTS'}
                    </Button>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="neo-brutal-card bg-yellow-300 p-6 text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <div className="text-3xl font-black text-yellow-800 mb-2">
                {score}/{questions.length}
              </div>
              <div className="font-black text-lg mb-2">
                {score === questions.length ? 'PERFECT SCORE!' : 
                 score >= questions.length * 0.8 ? 'EXCELLENT!' :
                 score >= questions.length * 0.6 ? 'GOOD JOB!' : 'KEEP STUDYING!'}
              </div>
              <div className="font-bold text-sm">
                {score === questions.length ? 'You mastered this concept!' :
                 'Review the explanations and try again'}
              </div>
              <Button
                onClick={resetExercise}
                className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                TRY AGAIN
              </Button>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    );
  };

  const renderFAABSimulatorContent = () => {
    const handleSubmitBid = () => {
      const bid = parseInt(bidAmount);
      const budget = 75;
      
      const otherBids = [25, 31, 18, 42, 29];
      const winningBid = Math.max(bid, ...otherBids);
      const won = bid === winningBid;
      
      const percentage = (bid / budget) * 100;
      let analysis;
      
      if (won) {
        if (percentage > 40) {
          analysis = {
            rating: 'AGGRESSIVE',
            feedback: 'You won but paid a premium. This better be a league winner!',
            color: 'orange'
          };
        } else if (percentage > 25) {
          analysis = {
            rating: 'EXCELLENT',
            feedback: 'Perfect bid! You secured the player at fair value.',
            color: 'green'
          };
        } else {
          analysis = {
            rating: 'STEAL',
            feedback: 'Amazing value! You got a great player for cheap.',
            color: 'green'
          };
        }
      } else {
        if (percentage < 15) {
          analysis = {
            rating: 'TOO CONSERVATIVE',
            feedback: 'Your bid was too low. Don\'t be afraid to pay for impact players.',
            color: 'red'
          };
        } else {
          analysis = {
            rating: 'REASONABLE',
            feedback: 'Fair bid, but someone wanted the player more. Consider going higher for impact adds.',
            color: 'yellow'
          };
        }
      }
      
      setBidResult({
        yourBid: bid,
        winningBid,
        won,
        otherBids: otherBids.filter(b => b !== bid),
        analysis
      });
      setShowResult(true);
    };

    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-black mb-2">FAAB BIDDING SIMULATOR</h4>
            <p className="font-bold text-gray-700">{element.scenario}</p>
          </div>

          <motion.div 
            className="neo-brutal-card bg-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-black mb-3">SITUATION</h5>
                <div className="space-y-2 text-sm font-bold">
                  <div>💰 Your Budget: {element.your_budget}</div>
                  <div>🏆 League: {element.league_context}</div>
                  <div>🎯 Player: {element.player_profile}</div>
                  <div>🤔 Decision: {element.bidding_decision}</div>
                </div>
              </div>

              <div>
                <h5 className="font-black mb-3">YOUR BID</h5>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Enter bid amount ($)"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="neo-brutal-input font-bold text-lg"
                      min="0"
                      max="75"
                    />
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSubmitBid}
                        disabled={!bidAmount || bidAmount <= 0 || showResult}
                        className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black w-full"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        SUBMIT BID
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Submit your FAAB bid and see if you win the player</p>
                    </TooltipContent>
                  </Tooltip>

                  {bidAmount && !showResult && (
                    <div className="p-3 bg-gray-100 border-2 border-black">
                      <div className="font-black text-sm">BID ANALYSIS</div>
                      <div className="font-bold text-xs">
                        ${bidAmount} = {Math.round((parseInt(bidAmount) / 75) * 100)}% of budget
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showResult && bidResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-100 border-3 border-black"
              >
                <h6 className="font-black text-lg mb-3">
                  {bidResult.won ? '🎉 YOU WON!' : '😞 YOU LOST'}
                </h6>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-black text-sm mb-2">BIDDING RESULTS</div>
                    <div className="space-y-1 text-sm font-bold">
                      <div>Your Bid: ${bidResult.yourBid}</div>
                      <div>Winning Bid: ${bidResult.winningBid}</div>
                      <div>Other Bids: ${bidResult.otherBids.join(', $')}</div>
                    </div>
                  </div>
                  
                  <div className={`p-3 border-2 border-black ${
                    bidResult.analysis.color === 'green' ? 'bg-green-200' :
                    bidResult.analysis.color === 'orange' ? 'bg-orange-200' :
                    bidResult.analysis.color === 'yellow' ? 'bg-yellow-200' : 'bg-red-200'
                  }`}>
                    <div className="font-black text-sm">{bidResult.analysis.rating}</div>
                    <div className="font-bold text-xs">{bidResult.analysis.feedback}</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-100 border-2 border-black">
                  <div className="font-black text-sm">💡 KEY LEARNING</div>
                  <div className="font-bold text-xs">
                    {bidResult.won ? 
                      "Winning FAAB bids in competitive leagues often require 25-35% of budget for impact players." :
                      "Don't be afraid to bid aggressively on clear upgrades. Conservative bidding loses championships."
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </TooltipProvider>
    );
  };

  // Simplified render logic
  if (element.type === "scoring_calculator" || element.type === "scoring_system_calculator") {
    return renderScoringCalculatorContent();
  } 
  
  if (element.type === "draft_simulator") {
    return renderDraftSimulatorContent();
  } 
  
  if (element.type === "league_format_quiz" || element.type === "draft_strategy_quiz" || element.type === "fantasy_basics_quiz") {
    return renderQuizContent();
  } 
  
  if (element.type === "faab_bidding_simulator") {
    return renderFAABSimulatorContent();
  }

  // Default exercise renderer for other types
  return (
    <motion.div
      className="neo-brutal-card bg-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-blue-500" />
        <h4 className="font-black text-lg">{element.type.replace(/_/g, ' ').toUpperCase()} EXERCISE</h4>
      </div>
      
      <p className="font-bold mb-4">{element.scenario}</p>
      
      <div className="p-4 bg-blue-100 border-3 border-black">
        <div className="font-black text-sm mb-2">🎯 LEARNING OBJECTIVE</div>
        <div className="font-bold text-sm">{element.learning_objective}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Badge className="bg-purple-500 text-white font-bold">
          INTERACTIVE EXERCISE
        </Badge>
        <Button
          onClick={() => handleAction('complete', { type: element.type }, element.type)}
          className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          COMPLETE
        </Button>
      </div>
    </motion.div>
  );
}