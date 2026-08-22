import React, { useState, useEffect } from "react";
import { TrainingModule, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  BookOpen,
  Video,
  Users,
  Target,
  Brain,
  TrendingUp,
  Trophy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveExercise from "../components/training/InteractiveExercise";

const categoryIcons = {
  basics: BookOpen,
  player_analysis: Target,
  injury_management: Users,
  trading: Users,
  advanced_strategy: Brain, // Changed icon
  weekly_management: TrendingUp, // New category
  playoff_strategy: Trophy // New category
};

const categoryColors = {
  basics: "bg-green-500",
  player_analysis: "bg-blue-500",
  injury_management: "bg-red-500",
  trading: "bg-purple-500",
  advanced_strategy: "bg-orange-500",
  weekly_management: "bg-cyan-500", // New category color
  playoff_strategy: "bg-yellow-500" // New category color
};



export default function Training() {
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    loadTrainingData();
  }, []);

  useEffect(() => {
    filterModules();
  }, [modules, searchTerm, selectedCategory, selectedDifficulty]);

  const loadTrainingData = async () => {
    try {
      const [trainingModules, currentUser] = await Promise.all([
        TrainingModule.list("order"),
        User.me()
      ]);
      setModules(trainingModules);
      setUser(currentUser);

      // If no modules exist, create sample ones
      if (trainingModules.length === 0) {
        await createSampleModules();
        const newModules = await TrainingModule.list("order");
        setModules(newModules);
      }
    } catch (error) {
      console.error("Error loading training data:", error);
    }
    setIsLoading(false);
  };

  const createSampleModules = async () => {
    const sampleModules = [
      // ENHANCED BEGINNER MODULE - Fantasy Football Basics
      {
        title: "Fantasy Football Basics",
        category: "basics",
        difficulty: "beginner",
        content_type: "interactive",
        description: "Complete beginner's guide to fantasy football - from draft to championship",
        content: {
          text: "**Welcome to Fantasy Football!**\n\nFantasy football is America's favorite hobby, combining your love of NFL football with strategic team management. You'll draft real NFL players, manage weekly lineups, and compete against friends based on actual player performance.\n\n**What is Fantasy Football?**\n\nThink of yourself as a team owner and general manager. You draft players from all 32 NFL teams to create your fantasy roster. Each week, you set a starting lineup, and your players earn points based on their real NFL performance.\n\n**How Fantasy Points Work:**\n\n*Quarterback Scoring:*\n- Passing yards: 1 point per 25 yards (12 yards = 0.48 points)\n- Passing touchdowns: 6 points each\n- Interceptions: -2 points each\n- Rushing yards: 1 point per 10 yards\n- Rushing touchdowns: 6 points each\n\n*Running Back Scoring:*\n- Rushing yards: 1 point per 10 yards\n- Rushing touchdowns: 6 points each\n- Receptions: 0, 0.5, or 1 point (depends on league format)\n- Receiving yards: 1 point per 10 yards\n- Receiving touchdowns: 6 points each\n\n*Wide Receiver/Tight End Scoring:*\n- Same as running back receiving stats\n- Receptions are crucial for consistent scoring\n- Target share determines opportunity\n\n*Kicker Scoring:*\n- Field goals: 3-5 points (longer = more points)\n- Extra points: 1 point each\n- Missed kicks: Usually -1 point\n\n*Defense/Special Teams:*\n- Points allowed determines base score\n- Sacks, interceptions, fumble recoveries: 1-2 points each\n- Touchdowns: 6 points\n- Safeties: 2 points\n\n**League Formats Explained:**\n\n*Standard Scoring:*\n- No points for receptions\n- Emphasizes big plays and touchdowns\n- Running backs typically more valuable\n- Good for beginners\n\n*PPR (Point Per Reception):*\n- 1 point for every catch\n- Makes pass-catching players more valuable\n- Reduces variance week-to-week\n- Most popular in competitive leagues\n\n*Half-PPR:*\n- 0.5 points per reception\n- Balance between Standard and PPR\n- Good compromise format\n\n**Your Fantasy Roster:**\n\n*Starting Lineup (most common):*\n- 1 Quarterback (QB): Your team's signal-caller\n- 2 Running Backs (RB): The workhorses\n- 2 Wide Receivers (WR): Big-play threats\n- 1 Tight End (TE): The forgotten position\n- 1 Flex (RB/WR/TE): Your best remaining player\n- 1 Kicker (K): Don't overthink this position\n- 1 Defense/ST (DEF): Stream matchups\n\n*Bench Players (6-7 spots):*\n- Backup QB (optional in most leagues)\n- 3-4 RB/WR for bye weeks and injuries\n- Handcuff RBs (backups to your starters)\n- Upside players for later in season\n\n**The Fantasy Season Timeline:**\n\n*Preseason (July-August):*\n- Research players and rankings\n- Join leagues and prepare for draft\n- Mock drafts to practice strategy\n\n*Draft Day (Late August/Early September):*\n- Most important day of your fantasy season\n- Snake draft: pick order reverses each round\n- Auction draft: bidding system for players\n\n*Regular Season (Weeks 1-14):*\n- Set lineups each week by Tuesday\n- Work the waiver wire for new players\n- Make trades to improve your team\n- Navigate bye weeks (weeks teams don't play)\n\n*Playoffs (Weeks 15-17):*\n- Top teams compete for championship\n- Different strategy: ceiling over floor\n- Weather becomes more important\n\n**Understanding Your Competition:**\n\n*Head-to-Head Leagues:*\n- Weekly matchups against one opponent\n- Win/loss record determines standings\n- Luck plays a bigger role\n- Most engaging format\n\n*Points-Only Leagues:*\n- Highest total points wins\n- Season-long accumulation\n- Rewards consistency\n- Less weekly drama\n\n**Key Fantasy Concepts:**\n\n*Bye Weeks:*\n- Every NFL team has one week off\n- Your players score 0 points that week\n- Plan ahead with bench players\n- Weeks 6-14 are bye weeks\n\n*Waivers:*\n- System for adding undrafted players\n- Usually runs Tuesday night/Wednesday morning\n- Priority based on standings or FAAB budget\n- Where you find league-winning pickups\n\n*Trades:*\n- Swap players with other managers\n- Usually processed in 1-2 days\n- Trade deadline around Week 10-11\n- Key to building championship teams\n\n*Streaming:*\n- Playing different players at same position each week\n- Common for kickers and defenses\n- Based on matchups and situations\n- Maximizes point potential\n\n**Week-to-Week Management:**\n\n*Setting Your Lineup:*\n- Check injury reports (Wednesday-Sunday)\n- Consider matchups and weather\n- Start your studs (don't overthink elite players)\n- Have a backup plan for questionable players\n\n*Waiver Wire Strategy:*\n- Target players with increased opportunity\n- Look for consistent target/carry trends\n- Handcuff your injury-prone players\n- Don't hold onto dead weight\n\n*Common Beginner Mistakes:*\n- Starting players on bye weeks\n- Overreacting to one bad game\n- Ignoring the waiver wire\n- Making emotional decisions\n- Not preparing for playoffs early enough\n\n**Building Your First Team:**\n\n*Draft Strategy for Beginners:*\n- Focus on consistent, proven players\n- Avoid injured or suspended players\n- Don't draft a kicker or defense too early\n- Have a cheat sheet with player rankings\n- Don't panic if your plan doesn't work\n\n*Managing Expectations:*\n- Even experts are wrong 40% of the time\n- Injuries and bad luck happen\n- Focus on process, not just results\n- Learn from mistakes each week\n- Have fun - it's entertainment!",
          interactive_elements: [
            {
              type: "scoring_system_calculator",
              scenario: "Learn how different scoring systems affect player values",
              learning_objective: "Understand the fundamental differences between Standard, PPR, and Half-PPR scoring",
              example_stats: {
                player_name: "Austin Ekeler",
                rushing_yards: 45,
                rushing_tds: 0,
                receptions: 8,
                receiving_yards: 65,
                receiving_tds: 1
              }
            },
            {
              type: "roster_construction_builder",
              scenario: "Build your first fantasy football starting lineup",
              learning_objective: "Learn the basic roster requirements and position importance",
              challenge: "Create a legal starting lineup with the provided player pool",
              constraints: "Must fill: 1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 K, 1 DEF"
            },
            {
              type: "fantasy_basics_quiz",
              scenario: "Test your understanding of fantasy football fundamentals",
              learning_objective: "Reinforce key concepts from the lesson",
              questions: [
                {
                  question: "How many points does a rushing touchdown score in most fantasy leagues?",
                  options: ["4 points", "6 points", "7 points", "It depends on the league"],
                  correct: 1,
                  explanation: "Rushing touchdowns are worth 6 points in standard fantasy scoring, just like receiving touchdowns."
                },
                {
                  question: "What does PPR stand for in fantasy football?",
                  options: ["Points Per Reception", "Points Per Rush", "Points Per Return", "Player Performance Rating"],
                  correct: 0,
                  explanation: "PPR stands for Point Per Reception, meaning players get 1 point for every catch they make."
                },
                {
                  question: "When do most fantasy football playoffs typically start?",
                  options: ["Week 13", "Week 14", "Week 15", "Week 16"],
                  correct: 2,
                  explanation: "Most fantasy playoffs start in Week 15 and run through Week 17, though some leagues vary."
                },
                {
                  question: "What is a 'bye week' in fantasy football?",
                  options: ["A week your player is injured", "A week when an NFL team doesn't play", "A week you can't set your lineup", "A week with double points"],
                  correct: 1,
                  explanation: "A bye week is when an NFL team has a scheduled week off, so their players score 0 fantasy points that week."
                }
              ]
            },
            {
              type: "waiver_wire_simulator",
              scenario: "Practice making your first waiver wire claim",
              learning_objective: "Understand how the waiver wire works and when to use it",
              available_players: [
                { name: "Backup RB", reason: "Starter got injured", priority: "High" },
                { name: "Streaming Defense", reason: "Good matchup this week", priority: "Medium" },
                { name: "Handcuff RB", reason: "Insurance for your starter", priority: "Low" }
              ]
            }
          ]
        },
        estimated_time: 30,
        order: 1
      },
      {
        title: "Draft Strategy Fundamentals",
        category: "basics", 
        difficulty: "beginner",
        content_type: "interactive",
        description: "Learn proven draft strategies from FantasyPros experts and Draft Sharks methodology",
        content: {
          text: "The draft is your foundation. A strong draft doesn't guarantee success, but a poor draft makes winning nearly impossible. Here are the core strategies used by top fantasy managers.\n\n**Draft Position Strategy:**\n\n*Early Picks (1-3):*\n- Target elite RBs with heavy workloads\n- Examples: CMC, Derrick Henry, Saquon Barkley\n- Strategy: Secure a positional advantage at RB\n- Follow-up: Target WRs in rounds 2-3\n\n*Middle Picks (4-8):*\n- Most flexible draft position\n- Can go RB-RB or RB-WR\n- Target consistent, high-floor players\n- Avoid risky boom/bust picks early\n\n*Late Picks (9-12):*\n- Embrace 'Zero RB' strategy potential\n- Target elite WRs like Jefferson, Hill, Adams\n- Wait on RB until value emerges\n- Focus on high-target share receivers\n\n**Positional Draft Strategy:**\n\n*Running Back Priority:*\n- Scarcest position for consistent production\n- Target 3-down backs with goal-line work\n- Handcuff your RB1 if possible\n- Avoid RBBC (running back by committee) situations\n\n*Wide Receiver Value:*\n- Deeper position with more weekly options\n- Target high air yards and target share\n- Red zone targets are crucial for TDs\n- Slot receivers more consistent in PPR\n\n*Quarterback Strategy:*\n- Wait until rounds 6-8 for your starter\n- Target dual-threat QBs (rushing upside)\n- Streaming is viable - don't reach early\n- Exception: Elite QBs in 6pt passing TD leagues\n\n*Tight End Tiers:*\n- Tier 1: Kelce, Andrews (massive advantage)\n- Tier 2: Kittle, Pitts (when healthy)\n- Tier 3: Everyone else (streamable)\n- Don't get caught between tiers\n\n**Advanced Draft Concepts:**\n\n*Value-Based Drafting (VBD):*\n- Compare players to replacement level\n- RBs typically have higher VBD early\n- Don't reach for positions you can stream\n\n*Positional Scarcity:*\n- 24 starting RBs vs 36+ starting WRs\n- Quality drops off faster at RB\n- Plan your bye weeks during draft\n\n*Best Ball Principles:*\n- Draft for ceiling, not floor\n- Prioritize target share and air yards\n- Avoid safe, boring players\n- Correlate players from high-scoring offenses",
          interactive_elements: [
            {
              type: "draft_simulator",
              scenario: "Practice making first-round picks from different draft positions",
              learning_objective: "Understanding how draft position affects strategy and available players"
            },
            {
              type: "positional_value_chart",
              scenario: "Learn positional scarcity through interactive charts",
              learning_objective: "Visualize why RBs are drafted earlier than WRs",
              data_visualization: "Interactive chart showing starter-quality players by position"
            },
            {
              type: "draft_strategy_quiz",
              scenario: "Test your draft knowledge with real scenarios",
              questions: [
                {
                  question: "You have pick #6 in a 12-team league. The top 3 RBs are gone. What's your best strategy?",
                  options: ["Take the #4 RB", "Take the #1 WR available", "Trade down for more picks"],
                  correct: 1,
                  explanation: "At pick 6, elite WRs often provide better value than the 4th RB tier"
                }
              ],
              learning_objective: "Solidify your understanding of core draft principles and decision-making."
            }
          ]
        },
        estimated_time: 35,
        order: 2
      },
      
      // INTERMEDIATE MODULES - Much more detailed and interactive
      {
        title: "Advanced Player Evaluation",
        category: "player_analysis",
        difficulty: "intermediate", 
        content_type: "interactive",
        description: "Learn to evaluate players like the pros using advanced metrics and target share analysis",
        content: {
          text: "Moving beyond basic stats requires understanding the metrics that predict future success. This is what separates good fantasy managers from great ones.\n\n**Target Share & Air Yards:**\n\nTarget share is the percentage of team targets a receiver gets. 20%+ is elite, 15-19% is solid, below 15% is concerning.\n\n*Why Target Share Matters:*\n- More predictive than TDs or yards\n- TDs regress to the mean\n- Target share stays more consistent\n- Volume is the key to fantasy success\n\n*Air Yards (Depth of Target):*\n- Average distance of targets downfield\n- Higher air yards = more big play potential\n- But lower completion percentage\n- Balance needed for consistency\n\n**Running Back Advanced Metrics:**\n\n*Snap Share:*\n- Percentage of offensive snaps played\n- 70%+ is elite bell-cow territory\n- 50-69% is solid starter\n- Below 50% is committee back\n\n*Goal Line Carries:*\n- Most predictive stat for RB TDs\n- Goal line = inside the 5-yard line\n- Short-yardage situations matter\n- Vultures steal TDs from yards leaders\n\n*Yards After Contact (YAC):*\n- Shows running ability independent of blocking\n- High YAC = talent, not just opportunity\n- Predicts success with new teams\n\n**Quarterback Evaluation:**\n\n*EPA (Expected Points Added):*\n- Measures QB performance vs. expected\n- Accounts for situation and field position\n- Better than basic passer rating\n- Positive EPA = above average performance\n\n*Rushing Floor:*\n- 300+ rushing yards adds 2-3 PPG\n- Lamar, Josh Allen, Jalen Hurts elite tier\n- Rushing provides safer weekly floor\n- Less dependent on passing game success\n\n**Injury Risk Assessment:**\n\n*Historical Injury Patterns:*\n- Soft tissue injuries (hamstring, groin) tend to recur\n- Structural injuries (ACL, broken bones) often heal completely\n- Age increases injury risk exponentially after 28\n- Position matters: RBs most injury-prone\n\n*Workload Concerns:*\n- 370+ touches often leads to decline\n- Heavy playoff usage affects next season\n- Rookie RBs handle workload better\n- Committee approaches preserve health\n\n**Strength of Schedule (SOS):*\n\n*Playoff Schedule Analysis:*\n- Weeks 15-17 matter most\n- Dome games in December = advantage\n- Divisional games often unpredictable\n- Teams locked into playoff seeding may rest stars\n- Backup QBs create different target distributions\n\n*Matchup-Proof Players:*\n- Elite talent overcomes bad matchups\n- Target share leaders less matchup-dependent\n- Home/road splits reveal true talent\n- Prime time performance indicators",
          interactive_elements: [
            {
              type: "metric_analyzer",
              scenario: "Compare two similar WRs using advanced metrics",
              player1: {
                name: "Player A",
                targets: 140,
                team_targets: 600,
                air_yards: 8.2,
                yac: 4.1,
                red_zone_targets: 18
              },
              player2: {
                name: "Player B", 
                targets: 120,
                team_targets: 580,
                air_yards: 12.4,
                yac: 3.2,
                red_zone_targets: 12
              },
              analysis_framework: "Calculate target share, evaluate upside vs. floor, project future performance",
              learning_objective: "Master the art of player comparison using data"
            },
            {
              type: "injury_risk_calculator",
              scenario: "Evaluate injury risk factors for draft decisions",
              factors: ["Age", "Previous injuries", "Workload", "Position", "Playing style"],
              learning_objective: "Balance talent vs. injury risk in draft decisions"
            },
            {
              type: "schedule_analyzer",
              scenario: "Analyze playoff schedules for championship planning",
              weeks: [15, 16, 17],
              factors: ["Opponent strength", "Home/away", "Weather", "Rest advantages"],
              learning_objective: "Plan ahead for fantasy playoffs"
            },
            {
              type: "breakout_predictor",
              scenario: "Identify breakout candidates using advanced metrics",
              criteria: ["Opportunity increase", "Target share trends", "Coaching changes", "Team improvements"],
              learning_objective: "Find league-winning sleepers before others"
            }
          ]
        },
        estimated_time: 40,
        order: 8
      },

      // WEEKLY MANAGEMENT - Enhanced waiver wire content
      {
        title: "Waiver Wire Mastery",
        category: "weekly_management",
        difficulty: "intermediate",
        content_type: "interactive",
        description: "Dominate your league's waiver wire using proven strategies from top fantasy analysts",
        content: {
          text: "The waiver wire is where championships are won and lost. More important than your draft, waiver success separates elite managers from the field.\n\n**Waiver Wire Systems:**\n\n*FAAB (Free Agent Acquisition Budget):*\n- Start with $100-1000 budget for season\n- Bid what you think player is worth\n- Highest bid wins, ties go to worse record\n- Most strategic system, rewards good evaluation\n\n*Rolling Waivers:*\n- Worst record gets first priority\n- Move to back of line after claim\n- Punishes success, rewards failure\n- Strategic: sometimes skip claims to keep priority\n\n*Reverse Standings:*\n- Worst record always picks first\n- No movement after claims\n- Least strategic system\n- Just claim everyone you want\n\n**FAAB Bidding Strategy:**\n\n*Week 1-3 Bidding (Aggressive Phase):*\n- Breakout players worth 25-40% of budget\n- Handcuffs to injured stars: 15-25%\n- Streaming options: 1-5%\n- Go big early - value decreases over time\n\n*Mid-Season Bidding (4-10):*\n- Proven producers: 20-35%\n- Injury replacements: 10-20%\n- Bye week fills: 5-10%\n- Handcuffs: 8-15%\n\n*Late Season Bidding (11-14):*\n- Championship pieces: 30-50%\n- Playoff schedule plays: 15-25%\n- Defense streamers: 5-10%\n- Kickers: 1-3%\n\n**Player Identification Strategies:**\n\n*Snap Count Analysis:*\n- 70%+ snaps often predicts breakout\n- Increasing snap trends more important than total\n- New role players getting more snaps\n- Target players with undefined roles\n\n*Target Share Trends:*\n- 15%+ target share sustainable\n- Look for 3-week trending increases\n- Injury-driven opportunities\n- Slot receivers more consistent\n\n*Opportunity Creation:*\n- Injuries to starters create immediate value\n- Bye weeks reveal depth chart\n- Trade deadlines shuffle depth charts\n- Coaching changes affect usage\n\n**Advanced Waiver Strategies:**\n\n*Handcuff Lottery:*\n- Target backup RBs behind injury-prone starters\n- Focus on clear backup situations\n- Committee backfields less valuable\n- Time claims for right before games\n\n*Streaming Optimization:*\n\nDefense Streaming:\n- Target defenses vs. backup QBs\n- Home favorites with good matchups\n- Turnover-prone opponents\n- Weather advantages (wind, cold)\n\nKicker Streaming:\n- Target kickers in dome games\n- High-scoring game environments\n- Teams likely to stall in red zone\n- Avoid teams with great red zone efficiency\n\n*Speculative Adds:*\n- Handcuffs before Thursday games\n- Players with upcoming good schedules\n- Injury-prone starter's backups\n- Late-season rookies getting opportunities\n\n**Roster Management:**\n\n*Drop Candidate Identification:*\n- Injured players with long timelines\n- Players with brutal upcoming schedules\n- Aging veterans losing snaps\n- Handcuffs to your traded players\n\n*Roster Churn Philosophy:*\n- Keep roster spots active\n- Don't hold dead weight\n- Speculative adds better than empty bench\n- Always improving, never satisfied",
          interactive_elements: [
            {
              type: "faab_bidding_simulator",
              scenario: "Week 3: Starting RB gets injured, backup available on waivers",
              your_budget: "$75 remaining of $100",
              league_context: "12-team competitive league, most teams still have $60+",
              player_profile: "Clear backup, 3-down potential, good offense",
              bidding_decision: "How much do you bid?",
              learning_objective: "Master FAAB bidding psychology and strategy"
            },
            {
              type: "waiver_priority_ranker",
              scenario: "Multiple good options available, rank your priorities",
              available_players: [
                "Handcuff RB (starter questionable)",
                "Emerging WR (3 straight weeks of targets)",
                "Streaming defense (vs backup QB)",
                "Speculative TE (starter aging)"
              ],
              strategy_question: "Consider your roster needs and league format",
              learning_objective: "Prioritize waiver claims like a pro"
            },
            {
              type: "snap_count_analyzer",
              scenario: "Identify breakout candidates using snap count trends",
              players: [
                { name: "Player X", snaps: [45, 52, 61], targets: [3, 5, 7] },
                { name: "Player Y", snaps: [38, 41, 39], targets: [8, 6, 9] },
                { name: "Player Z", snaps: [22, 44, 58], targets: [2, 4, 6] }
              ],
              learning_objective: "Spot trends before they become obvious"
            },
            {
              type: "streaming_scheduler",
              scenario: "Plan your streaming strategy for the next 4 weeks",
              positions: ["Defense", "Kicker", "QB"],
              matchups: "Week 8-11 opponents and contexts provided",
              learning_objective: "Think ahead and plan streaming moves"
            }
          ]
        },
        estimated_time: 35,
        order: 12
      },

      // ADVANCED TRADING MODULE
      {
        title: "Advanced Trading Strategies",
        category: "trading",
        difficulty: "advanced",
        content_type: "interactive", 
        description: "Master the art of fantasy football trading using proven negotiation tactics and value assessment",
        content: {
          text: "Elite fantasy managers use trades as their secret weapon. While others wait for luck, traders create their own championship paths.\n\n**Trade Value Assessment:**\n\n*Positional Scarcity Premiums:*\n- RB1s command highest premiums\n- Elite TEs worth significant overpay\n- QB streaming reduces QB trade value\n- WR depth makes WR2s less valuable\n\n*Situation-Based Value:*\n- Bye weeks affect short-term value\n- Playoff schedule impacts late-season value\n- Injury concerns create buying opportunities\n- Age curves affect dynasty vs. redraft value\n\n**Trade Timing Strategies:**\n\n*Early Season (Weeks 1-4):*\n- Target buy-low candidates after slow starts\n- Sell aging veterans before decline\n- Acquire injured players for playoffs\n- Exploit overreactions to small samples\n\n*Mid-Season (Weeks 5-10):*\n- Consolidate depth for star players\n- Target players with easy playoff schedules\n- Sell boom/bust players after boom weeks\n- Acquire handcuffs to injury-prone players\n\n*Late Season (Weeks 11-14):*\n- All-in moves for championship contenders\n- Sell future for immediate help\n- Target playoff schedule advantages\n- Acquire players returning from injury\n\n**Negotiation Psychology:**\n\n*Building Rapport:*\n- Start conversations about their team needs\n- Compliment their good moves\n- Show genuine interest in mutually beneficial deals\n- Avoid insulting initial offers\n\n*Creating Win-Win Scenarios:*\n- Identify complementary needs\n- Package deals that help both teams\n- Consider timing differences (now vs. later)\n- Account for roster construction differences\n\n*Advanced Negotiation Tactics:*\n- Anchor with reasonable but favorable offers\n- Bundle players to disguise true targets\n- Create artificial urgency (injury news, etc.)\n- Use league dynamics (rival teams, playoff races)\n\n**Trade Types & Applications:**\n\n*Buy-Low Opportunities:*\n- Target players with name recognition but poor recent performance\n- Look for positive regression candidates\n- Focus on players with upcoming easy schedules\n- Acquire players returning from minor injuries\n\n*Sell-High Windows:*\n- Move players after career games\n- Sell aging veterans before decline\n- Trade players with concerning injury histories\n- Move players facing difficult upcoming schedules\n\n*Championship Trades:*\n- 2-for-1 deals upgrading starting lineups\n- Acquire playoff schedule advantages\n- Target proven performers over upside plays\n- Consider dome players for December games\n\n*League-Specific Strategies:*\n\n*PPR vs. Standard:*\n- PPR: Target high-catch players\n- Standard: Focus on touchdown upside\n- Half-PPR: Balance catches with big plays\n\n*Superflex Considerations:*\n- QBs become premium trade assets\n- Streaming QB2 becomes difficult\n- Rushing QBs have higher floors\n- Backup QBs have trade value\n\n*Dynasty Trading:*\n- Age curves matter more\n- Draft picks have significant value\n- Rookie potential vs. proven production\n- Contract situations affect value\n\n*Common Trading Mistakes:*\n\n*Emotional Decisions:*\n- Don't trade out of frustration\n- Avoid revenge trades against rivals\n- Don't fall in love with your draft picks\n- Separate player evaluation from personal bias\n\n*Value Miscalculations:*\n- Overvaluing name recognition\n- Underestimating positional scarcity\n- Ignoring schedule considerations\n- Not accounting for roster construction needs",
          interactive_elements: [
            {
              type: "trade_analyzer",
              scenario: "Evaluate this trade offer using multiple value systems",
              trade_offer: {
                you_give: ["Alvin Kamara", "DJ Moore"],
                you_get: ["Ja'Marr Chase", "Josh Jacobs", "2024 2nd round pick"]
              },
              context: "Week 6, you're 2-4 and need to make playoffs",
              analysis_framework: ["Positional value", "Schedule strength", "Injury risk", "Age/longevity"],
              negotiation_advice: "How to counter-offer if declining",
              learning_objective: "Analyze trades from multiple angles"
            },
            {
              type: "trade_negotiation_sim",
              scenario: "Practice negotiating a complex 3-team trade",
              your_needs: "Need RB depth, have WR surplus",
              partner_needs: "Need WR help, have RB depth", 
              third_team: "Rebuilding, wants draft picks",
              challenge: "Structure a deal that helps all three teams",
              learning_objective: "Master complex multi-team negotiations"
            },
            {
              type: "buy_low_identifier",
              scenario: "Spot buy-low candidates after Week 4",
              players: [
                { name: "Star Player", adp: 12, current_rank: 35, reason: "Tough schedule" },
                { name: "Veteran RB", adp: 18, current_rank: 42, reason: "Slow start" },
                { name: "Elite WR", adp: 8, current_rank: 28, reason: "QB struggles" }
              ],
              learning_objective: "Identify when poor performance creates opportunity"
            },
            {
              type: "trade_value_calculator",
              scenario: "Calculate fair trade values using multiple systems",
              systems: ["ADP-based", "Season-long points", "Recent form", "ROS projections"],
              learning_objective: "Understand different value perspectives"
            }
          ]
        },
        estimated_time: 50,
        order: 18
      },

      // INJURY MANAGEMENT MODULE
      {
        title: "Injury Management & Roster Depth",
        category: "injury_management",
        difficulty: "intermediate",
        content_type: "interactive",
        description: "Navigate injuries like a pro — know when to hold, when to drop, and how to build injury-proof rosters",
        content: {
          text: "**Injury Management: The Hidden Skill**\n\nMore fantasy seasons are lost to poor injury management than bad drafts. Learning to react correctly and quickly to injuries separates champions from also-rans.\n\n**Understanding Injury Reports**\n\nNFL teams release injury reports on Wednesday, Thursday, and Friday:\n- **Full Participant (FP):** Practiced fully — green light to start\n- **Limited Participant (LP):** Practiced limited — monitor closely\n- **Did Not Participate (DNP):** Did not practice — likely out\n- **Questionable:** 50/50 chance to play\n- **Doubtful:** Less than 25% chance to play\n- **Out:** Will not play\n\n*Pro Tip: Wednesday practice status is least predictive. Friday is the most important injury report of the week.*\n\n**Injury Type Risk Assessment**\n\n*High Risk to Miss Time:*\n- ACL/MCL tears: 6-9 months (season-ending)\n- Broken bones: 4-8 weeks\n- Hamstring grade 2+: 3-6 weeks\n- High ankle sprains: 2-6 weeks\n\n*Moderate Risk:*\n- Low ankle sprains: 1-3 weeks\n- Hamstring grade 1: 1-2 weeks\n- Rib injuries: Game-time decisions\n- Shoulder injuries: Varies widely\n\n*Often Play Through:*\n- Knee contusions\n- Hand/finger injuries\n- Low-grade muscle soreness\n- Illness (unless multiple players)\n\n**Roster Construction for Injury Resistance**\n\n*The Handcuff Strategy:*\nA handcuff is the backup RB behind your starter. When your RB1 gets injured, your handcuff immediately becomes a starter.\n\nHandcuff Priority Levels:\n- Tier 1: Backup to injury-prone RB1 with proven workload\n- Tier 2: Backup in clear 1-2 punch situation\n- Tier 3: Backup behind healthy, durable starter\n\n*Position Flexibility:*\n- FLEX spot allows RB/WR/TE interchangeability\n- Keep 2 TEs if streaming (injury insurance)\n- WR depth easier to find than RB depth\n- Backup QB rarely worth a roster spot (12-team leagues)\n\n**Waiver Wire Response to Injuries**\n\n*Immediate Response (Within Hours):*\n- When a starter is injured during a game, claim the backup ASAP\n- In FAAB leagues, be aggressive — pay 20-35% for clear handcuffs\n- Don't wait for waivers; in free agent systems, add immediately\n\n*Next Day Analysis:*\n- Read injury reports carefully\n- Understand the severity before panicking\n- Check beat reporters and team official statements\n- Monitor practice reports (Wed-Fri)\n\n**When to Drop an Injured Player**\n\n*Drop Immediately:*\n- Season-ending injuries (ACL, broken leg)\n- Players with 6+ week timelines with no open roster spot\n- Aging veterans (30+) with significant injuries\n\n*Hold Short-Term:*\n- 1-3 week injuries with clear return dates\n- Star players where no one better is available\n- Players returning from injury with reduced role risk\n\n*Never Drop Without Research:*\n- Check their roster percentage in your league\n- Understand the team's depth chart\n- Consider playoff schedule timing\n- Factor in dynasty vs. redraft considerations",
          interactive_elements: [
            {
              type: "injury_risk_calculator",
              scenario: "Your RB1 exits the game with a hamstring injury. Assess the risk and next steps.",
              factors: ["Injury type", "Age of player", "Week of season", "Playoff implications", "Available replacements"],
              learning_objective: "Make fast, accurate decisions when injuries occur"
            },
            {
              type: "waiver_wire_simulator",
              scenario: "Your WR1 just suffered a high ankle sprain and is listed as week-to-week. Who do you add?",
              learning_objective: "React quickly and correctly to injury news",
              available_players: [
                { name: "WR Handcuff", reason: "Now elevated to starter role", priority: "High" },
                { name: "TE Streamable", reason: "Good matchup this week", priority: "Medium" },
                { name: "RB Depth", reason: "Potential handcuff situation", priority: "Low" }
              ]
            },
            {
              type: "draft_strategy_quiz",
              scenario: "Test your injury management knowledge",
              questions: [
                {
                  question: "A player is listed as 'Questionable' on Friday's injury report. What should you do?",
                  options: ["Start them — they usually play", "Bench them to be safe", "Check for updates Sunday morning and have a backup ready", "Drop them immediately"],
                  correct: 2,
                  explanation: "Questionable means roughly 50/50. Always have a backup plan and check for late-breaking news Sunday morning before kickoff."
                },
                {
                  question: "Your RB1 tears their ACL in Week 3. What's your best move?",
                  options: ["Drop them immediately", "Hold them in case of miraculous recovery", "Drop them and claim their backup on waivers", "Trade them for any player you can get"],
                  correct: 2,
                  explanation: "ACL tears are season-ending. Drop them to free up roster space, and immediately target their backup who now has a starting role."
                }
              ],
              learning_objective: "Make smart decisions under injury pressure"
            }
          ]
        },
        estimated_time: 35,
        order: 10
      },

      // WEEKLY LINEUP DECISIONS MODULE
      {
        title: "Weekly Lineup Decisions",
        category: "weekly_management",
        difficulty: "beginner",
        content_type: "interactive",
        description: "Master the weekly lineup process — from injury reports to matchup analysis to final decisions",
        content: {
          text: "**The Weekly Lineup Routine**\n\nWinning at fantasy football is about consistent process. Elite managers follow the same routine every week, minimizing emotional decisions and maximizing data-driven choices.\n\n**Your Weekly Schedule**\n\n*Tuesday:*\n- Review last week's performance\n- Identify players to drop from roster\n- Target players to add from waivers\n- Submit waiver claims (FAAB or priority)\n\n*Wednesday-Thursday:*\n- Read injury designations from practice\n- Look for workload trends from beat reporters\n- Evaluate potential starts/sits at flex positions\n- Consider trade opportunities\n\n*Friday:*\n- Final injury reports released (most important)\n- Update your lineup based on participation\n- Finalize streaming decisions (DEF, K, matchup-based)\n- Have backup plans identified\n\n*Saturday-Sunday Morning:*\n- Check for last-minute injury news\n- Monitor game-time decisions closely\n- Make final lineup swaps as needed\n- Lock in early game players before 1pm ET kickoff\n\n**Matchup Analysis Framework**\n\n*What Actually Matters:*\n\n1. **Target Share / Snap Count** — Opportunity is #1 predictor\n2. **Red Zone Opportunities** — Most predictive for TDs\n3. **Defensive Rankings vs. Position** — Not all defenses equal\n4. **Game Script Projection** — Will team run or pass?\n5. **Home/Road Splits** — Some players struggle away\n6. **Weather** — Wind kills passing, rain favors run game\n\n*What Doesn't Matter as Much:*\n- Last week's box score (small sample)\n- Name recognition / reputation\n- How you \"feel\" about a player\n- Who you drafted them in auction for\n\n**The Start/Sit Decision Framework**\n\n*Always Start (Don't Overthink):*\n- Top-10 players at their position\n- Players with 20%+ target share\n- Bell-cow RBs with goal line work\n- Your proven weekly studs\n\n*Situational Starts:*\n- WRs vs. bad cornerback matchups\n- RBs in projected positive game scripts\n- TEs on teams with poor WR depth\n- Quarterbacks with rushing upside\n\n*When to Bench a Stud:*\n- Only legitimate injury concerns\n- Confirmed reduced role (not rumor)\n- Bye week of course\n\n**Streaming Strategy**\n\n*Quarterback Streaming:*\n- Target QBs vs. bottom-10 defenses vs. QB\n- Dome games eliminate weather risk\n- Dual-threat QBs have safer floors\n- Divisional underdogs often throw more\n\n*Defense Streaming:*\n- Target teams playing backup QBs\n- Road teams in bad weather\n- Teams with strong pass rushes vs. bad OLs\n- Home teams as 7+ point favorites\n\n*Kicker Streaming:*\n- Target high-scoring game environments\n- Dome kickers in December\n- Teams with reliable red zone struggles (more FG opportunities)\n- Avoid kickers in wind/snow games\n\n**Common Weekly Mistakes**\n\n- Starting a player just because you drafted them high\n- Benching hot players based on one bad week\n- Not checking injury reports before Sunday morning\n- Forgetting about bye weeks\n- Overreacting to Thursday night performances\n- Setting lineups early and forgetting to update",
          interactive_elements: [
            {
              type: "draft_strategy_quiz",
              scenario: "Test your weekly lineup decision-making",
              questions: [
                {
                  question: "It's Sunday morning. Your WR2 is listed as 'Questionable' with a knee injury. He didn't practice Wed or Thu but was limited Friday. What do you do?",
                  options: ["Start him — he practiced Friday", "Bench him immediately and start your backup WR", "Wait for pre-game warmup reports and have your backup ready", "Drop him and grab someone from waivers"],
                  correct: 2,
                  explanation: "Limited on Friday after two DNPs is a concerning sign. Wait for warmup reports ~90 minutes before game time, and have your backup slider ready to swap quickly if needed."
                },
                {
                  question: "Your RB is a proven RB2 but faces the #1 rushing defense this week. Your backup RB is unproven but faces the #32 defense. What do you do?",
                  options: ["Start the proven RB2 — matchups are overrated", "Start the backup — great matchup", "Check snap counts and workload data for both", "Flip a coin"],
                  correct: 2,
                  explanation: "Matchups matter, but opportunity matters more. Check if the backup RB actually has a featured role. A 60% snap-share RB2 vs. a weak defense beats a 40% share back vs. any defense."
                },
                {
                  question: "Your kicker plays in Green Bay in January. Wind speeds are 25 mph. What do you do?",
                  options: ["Keep him — he's a reliable kicker", "Stream a dome kicker this week", "Drop him from your roster", "Nothing — weather doesn't affect kickers"],
                  correct: 1,
                  explanation: "25 mph winds significantly impact field goal range and accuracy. Always stream a dome or indoor stadium kicker when your regular kicker faces harsh weather conditions."
                }
              ],
              learning_objective: "Build a reliable weekly decision-making process"
            },
            {
              type: "streaming_scheduler",
              scenario: "Plan your streaming moves for Weeks 10-13 based on matchups",
              positions: ["Defense", "Kicker", "QB"],
              matchups: "Week 10-13 schedule and opponent quality provided",
              learning_objective: "Think multiple weeks ahead with streaming"
            }
          ]
        },
        estimated_time: 25,
        order: 5
      },

      // CHAMPIONSHIP STRATEGY MODULE
      {
        title: "Championship Week Strategy",
        category: "playoff_strategy",
        difficulty: "advanced",
        content_type: "interactive", 
        description: "Master the art of building and managing championship rosters using pro strategies",
        content: {
          text: "Championship week requires a completely different mindset. Your regular season strategies won't work when everything is on the line.\n\n**Championship Roster Construction:**\n\n*Ceiling Over Floor Philosophy:*\n- Regular season: Minimize risk, maximize floor\n- Championship week: Maximize ceiling, accept risk\n- Start boom/bust players over consistent ones\n- One big week beats 3 decent weeks\n\n*Correlation Strategies:*\n- Stack QB with WR/TE from same team\n- Target players from same high-scoring games\n- Weather and dome considerations crucial\n- Avoid negative correlation (opponent's defense)\n\n**Schedule Analysis for Championships:**\n\n*Week 16/17 Matchup Evaluation:*\n- Dome games eliminate weather risk\n- Divisional games often unpredictable\n- Teams locked into playoff seeding may rest stars\n- Backup QBs create different target distributions\n\n*Game Script Considerations:*\n- Target players in projected shootouts\n- Avoid players from likely blowouts\n- Road underdogs often throw more\n- Home favorites can control with run game\n\n**Advanced Championship Tactics:**\n\n*Lineup Construction by League Format:*\n\nSuperFlex Leagues:\n- QB becomes premium position\n- Stream favorable matchups at QB2\n- Target rushing QBs for floor\n- Avoid QBs facing elite pass rush\n\nBest Ball Championships:\n- Draft for ceiling, not floor\n- Prioritize target share and air yards\n- Avoid safe, boring players\n- Build around game stacks\n\n*Weather Impact Analysis:*\n- Wind affects passing more than temperature\n- Snow favors running games and short passes\n- Rain reduces total scoring\n- Dome teams struggle outdoors in cold\n\n**Player Evaluation for Championships:**\n\n*Playoff-Proven Players:*\n- Experience in big games matters\n- Clutch performance history\n- Health status entering playoffs\n- Motivation factors (contract years, etc.)\n\n*Matchup Exploitation:*\n- Target specific defensive weaknesses\n- Exploit pace-of-play mismatches\n- Find revenge game narratives\n- Consider coaching tendencies\n\n**Risk Management:**\n\n*Diversification Strategies:*\n- Don't put all eggs in one basket\n- Balance high-ceiling with safe plays\n- Have pivot options ready\n- Monitor injury reports closely\n\n*Backup Plan Development:*\n- Identify late-week pickup options\n- Know your league's waiver rules\n- Have Sunday morning pivots ready\n- Don't get too cute with lineup changes",
          interactive_elements: [
            {
              type: "championship_optimizer",
              scenario: "Build the optimal championship lineup",
              constraints: "Must include at least one boom/bust player",
              weather_factor: "Championship week features snow in Buffalo, wind in Chicago",
              strategy_decision: "Choose between safety and upside for each position",
              learning_objective: "Master championship lineup construction"
            },
            {
              type: "game_stack_builder", 
              scenario: "Identify the best game environments for stacking",
              factors: ["Vegas totals", "Weather", "Pace of play", "Defensive rankings"],
              learning_objective: "Build correlated lineups for maximum ceiling"
            },
            {
              type: "weather_impact_analyzer",
              scenario: "Adjust your lineup based on weather reports",
              conditions: ["Snow in Green Bay", "Wind in Chicago", "Rain in Seattle"],
              players_affected: ["Outdoor kickers", "Deep ball receivers", "Passing QBs"],
              learning_objective: "Factor weather into championship decisions"
            },
            {
              type: "playoff_schedule_ranker",
              scenario: "Rank players by playoff schedule strength",
              weeks: [15, 16, 17],
              factors: ["Opponent defense rank", "Home/away", "Rest advantages", "Motivation"],
              learning_objective: "Plan 3 weeks ahead for championship run"
            }
          ]
        },
        estimated_time: 45,
        order: 20
      }
    ];

    await TrainingModule.bulkCreate(sampleModules);
  };

  const filterModules = () => {
    let filtered = modules;

    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(module => module.category === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(module => module.difficulty === selectedDifficulty);
    }

    setFilteredModules(filtered);
  };

  const isModuleCompleted = (moduleId) => {
    return user?.completed_modules?.includes(moduleId) || false;
  };

  const handleStartModule = (module) => {
    setSelectedModule(module);
    setCurrentSection(0); // Reset to first section when starting a new module
  };

  const handleCompleteModule = async (moduleId) => {
    try {
      const completedModules = user?.completed_modules || [];
      if (!completedModules.includes(moduleId)) {
        await User.updateMyUserData({
          completed_modules: [...completedModules, moduleId]
        });
        // Refresh user data
        const updatedUser = await User.me();
        setUser(updatedUser);
      }
      setSelectedModule(null); // Go back to module list
    } catch (error) {
      console.error("Error completing module:", error);
    }
  };

  const getModuleSections = (module) => {
    // Split content by "\n\n**" to define sections. The first part before any ** is the first section.
    const content = module.content?.text || "";
    const parts = content.split('\n\n**');
    const sections = parts.map((part, index) => {
        // If it's not the first part, prepend "**" back to restore the heading format
        return index === 0 ? part : '**' + part;
    }).filter(section => section.trim().length > 0); // Filter out any empty sections

    return sections;
  };

  const renderModuleContent = () => {
    if (!selectedModule) return null;

    const sections = getModuleSections(selectedModule);
    const currentSectionContent = sections[currentSection] || "";

    // Process markdown-like formatting for display
    const formattedContent = currentSectionContent
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>') // Bold text enclosed in *
      .replace(/\n/g, '<br/>'); // Newlines to <br/>

    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {sections.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 flex-1 border-2 border-black ${
                index <= currentSection ? 'bg-green-500' : 'bg-gray-200'
              }`}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: index <= currentSection ? 1 : 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div 
          className="neo-brutal-card bg-yellow-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="prose max-w-none">
            <div
              className="text-base font-bold leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </div>
        </motion.div>

        {/* Interactive Elements */}
        {selectedModule.content?.interactive_elements && (
          <AnimatePresence>
            <motion.div 
              className="neo-brutal-card bg-blue-100 p-6 mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-black mb-4">INTERACTIVE EXERCISE</h3>
              {selectedModule.content.interactive_elements.map((element, index) => (
                <InteractiveExercise key={index} element={element} moduleTitle={selectedModule.title} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="neo-brutal-button bg-gray-500 hover:bg-gray-600 text-white font-black"
          >
            ← PREVIOUS
          </Button>

          <span className="font-black">
            SECTION {currentSection + 1} OF {sections.length}
          </span>

          {currentSection < sections.length - 1 ? (
            <Button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black"
            >
              NEXT →
            </Button>
          ) : (
            <Button
              onClick={() => handleCompleteModule(selectedModule.id)}
              className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              COMPLETE MODULE
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedModule) {
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
          `}
        </style>

        <div className="max-w-4xl mx-auto">
          <div className="neo-brutal-card bg-white p-8">
            <div className="mb-6">
              <Button
                onClick={() => setSelectedModule(null)}
                className="neo-brutal-button bg-gray-500 hover:bg-gray-600 text-white font-black mb-4"
              >
                ← BACK TO TRAINING
              </Button>

              <h1 className="text-3xl font-black mb-2">{selectedModule.title}</h1>
              <p className="text-lg font-bold text-gray-600 mb-4">{selectedModule.description}</p>

              <div className="flex items-center gap-3 mb-6">
                <Badge className={`${categoryColors[selectedModule.category]} text-white font-bold`}>
                  {selectedModule.category.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline" className="font-bold border-2 border-black">
                  {selectedModule.difficulty.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">{selectedModule.estimated_time} min</span>
                </div>
              </div>
            </div>

            {renderModuleContent()}
          </div>
        </div>
      </div>
    );
  }

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
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }

          .neo-brutal-input {
            border: 3px solid #000000 !important;
            box-shadow: 3px 3px 0px #000000 !important;
          }

          .module-card {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
            cursor: pointer;
          }

          .module-card:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2 transform -rotate-1">
            TRAINING ACADEMY
          </h1>
          <p className="text-xl font-bold text-gray-600">
            Master fantasy football with interactive lessons and simulations
          </p>
        </div>

        {/* Filters */}
        <div className="neo-brutal-card bg-white p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-xl font-black">FILTER MODULES</h2>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-sm mb-2">SEARCH</label>
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-brutal-input font-bold"
              />
            </div>

            <div>
              <label className="block font-black text-sm mb-2">CATEGORY</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="neo-brutal-input font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="basics">Basics</SelectItem>
                  <SelectItem value="player_analysis">Player Analysis</SelectItem>
                  <SelectItem value="injury_management">Injury Management</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="advanced_strategy">Advanced Strategy</SelectItem>
                  <SelectItem value="weekly_management">Weekly Management</SelectItem>
                  <SelectItem value="playoff_strategy">Playoff Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-black text-sm mb-2">DIFFICULTY</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="neo-brutal-input font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="neo-brutal-button bg-gray-500 hover:bg-gray-600 text-white font-black w-full"
              >
                RESET
              </Button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredModules.map((module) => {
            const IconComponent = categoryIcons[module.category] || BookOpen;
            const isCompleted = isModuleCompleted(module.id);

            return (
              <div
                key={module.id}
                onClick={() => handleStartModule(module)}
                className={`module-card p-6 bg-white ${isCompleted ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${categoryColors[module.category]} rounded-full flex items-center justify-center border-3 border-black`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <h3 className="text-xl font-black mb-2">{module.title}</h3>
                <p className="font-bold text-gray-600 mb-4 text-sm">{module.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${categoryColors[module.category]} text-white font-bold text-xs`}>
                    {module.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="font-bold border-2 border-black text-xs">
                    {module.difficulty.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-sm">{module.estimated_time} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {module.content_type === 'video' && <Video className="w-4 h-4" />}
                    {!isCompleted ? (
                      <PlayCircle className="w-5 h-5 text-blue-500" />
                    ) : (
                      <span className="font-black text-green-500 text-sm">COMPLETED</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-black text-gray-600 mb-2">NO MODULES FOUND</h3>
            <p className="font-bold text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}