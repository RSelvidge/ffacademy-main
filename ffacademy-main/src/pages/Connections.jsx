
import React, { useState, useEffect } from "react";
import { User, LeagueConnection } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core"; // Added InvokeLLM import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ExternalLink, 
  Trash2, 
  RefreshCw,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Loader2 // Added Loader2 import
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const platforms = [
  { 
    id: "espn", 
    name: "ESPN Fantasy", 
    color: "bg-red-500", 
    logo: "🏈",
    description: "Connect your ESPN fantasy leagues",
    connection_guide: "Go to your ESPN league page, copy the league ID from the URL (after leagueId=)"
  },
  { 
    id: "yahoo", 
    name: "Yahoo Fantasy", 
    color: "bg-purple-500", 
    logo: "🟣",
    description: "Sync with Yahoo Fantasy Sports",
    connection_guide: "Paste your Yahoo fantasy league URL from football.fantasysports.yahoo.com. Make sure your league is public or viewable."
  },
  { 
    id: "sleeper", 
    name: "Sleeper", 
    color: "bg-blue-500", 
    logo: "💤",
    description: "Import from Sleeper app",
    connection_guide: "Your league ID is in the Sleeper app URL when viewing your league"
  },
  { 
    id: "nfl", 
    name: "NFL.com Fantasy", 
    color: "bg-blue-600", 
    logo: "🏆",
    description: "Import from NFL.com fantasy leagues",
    connection_guide: "Paste your NFL fantasy league URL from fantasy.nfl.com. Make sure your league is set to public or viewable."
  }
];

export default function Connections() {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    league_name: "",
    league_id: "",
    team_name: "",
    league_url: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState({});
  const [showConnectionGuide, setShowConnectionGuide] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [currentUser, leagueConnections] = await Promise.all([
        User.me(),
        LeagueConnection.list()
      ]);
      setUser(currentUser);
      setConnections(leagueConnections);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // New Yahoo scraper function
  const scrapeYahooLeagueData = async (leagueUrl) => {
    try {
      const scrapingPrompt = `
        You are an expert web scraper. Your task is to visit the provided Yahoo Fantasy Football league URL and extract specific data.
        The league is public. If you encounter any issues like JavaScript-heavy pages or loading delays, be persistent.
        
        The URL is: ${leagueUrl}
        
        Please extract the following information and return it as a structured JSON object:
        
        1. League name
        2. League ID (from the URL - it's the number after /f1/ in the URL)
        3. Current standings (for each team: team name, owner, wins, losses, ties, points for, points against, current rank)
        4. Scoring format (Standard, PPR, Half-PPR, etc., from league settings)
        5. Current or most recent week matchups and scores
        6. League settings (roster positions, playoff format, trade deadline, waiver type)
        7. All team rosters with player names, positions, NFL teams, and status
        
        If the league is private or inaccessible, return an error message in the 'error' field and set 'success' to false.
        
        Return the data in this exact JSON format:
        {
          "success": true,
          "error": null,
          "data": {
            "league_name": "League Name",
            "league_id": "extracted from URL",
            "scoring_format": "PPR/Standard/Half-PPR",
            "teams": [
              {
                "team_id": "unique_identifier_for_team",
                "team_name": "Team Name",
                "owner": "Owner Name",
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "points_for": 0,
                "points_against": 0,
                "rank": 1,
                "roster": [
                  {
                    "player_name": "Player Name",
                    "position": "QB/RB/WR/TE/K/DEF",
                    "nfl_team": "Team Abbreviation",
                    "status": "Active/Injured/Bye"
                  }
                ]
              }
            ],
            "matchups": [
              {
                "week": 1,
                "team1_id": "team_identifier_1",
                "team1_score": 0,
                "team2_id": "team_identifier_2", 
                "team2_score": 0
              }
            ],
            "league_settings": {
              "roster_positions": "1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 K, 1 DEF",
              "playoff_format": "Weeks 15-17",
              "trade_deadline": "Week 10",
              "waiver_type": "Waivers"
            }
          }
        }
      `;

      const result = await InvokeLLM({
        prompt: scrapingPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string", nullable: true },
            data: {
              type: "object",
              properties: {
                league_name: { type: "string" },
                league_id: { type: "string" },
                scoring_format: { type: "string" },
                teams: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      team_id: { type: "string" },
                      team_name: { type: "string" },
                      owner: { type: "string" },
                      wins: { type: "number" },
                      losses: { type: "number" },
                      ties: { type: "number" },
                      points_for: { type: "number" },
                      points_against: { type: "number" },
                      rank: { type: "number" },
                      roster: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            player_name: { type: "string" },
                            position: { type: "string" },
                            nfl_team: { type: "string" },
                            status: { type: "string" }
                          },
                          required: ["player_name", "position", "nfl_team"]
                        }
                      }
                    },
                    required: ["team_id", "team_name", "wins", "losses", "points_for", "rank", "roster"]
                  }
                },
                matchups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      week: { type: "number" },
                      team1_id: { type: "string" },
                      team1_score: { type: "number" },
                      team2_id: { type: "string" },
                      team2_score: { type: "number" }
                    },
                    required: ["week", "team1_id", "team1_score", "team2_id", "team2_score"]
                  }
                },
                league_settings: {
                  type: "object",
                  properties: {
                    roster_positions: { type: "string" },
                    playoff_format: { type: "string" },
                    trade_deadline: { type: "string" },
                    waiver_type: { type: "string" }
                  }
                }
              },
              required: ["league_name", "league_id", "scoring_format", "teams", "matchups", "league_settings"]
            }
          },
          required: ["success", "data"]
        }
      });

      return result;
    } catch (error) {
      console.error("Error scraping Yahoo league data:", error);
      return {
        success: false,
        error: "Failed to scrape league data. This might be due to an invalid URL, a private league, or a network issue. Please check the URL and try again.",
        data: null
      };
    }
  };

  // New function to scrape NFL.com league data using LLM
  const scrapeNFLLeagueData = async (leagueUrl) => {
    try {
      const scrapingPrompt = `
        You are an expert web scraper. Your task is to visit the provided NFL.com fantasy football league URL and extract specific data.
        The league is public. If you encounter any issues like JavaScript-heavy pages or loading delays, be persistent. 
        
        The URL is: ${leagueUrl}
        
        Please extract the following information and return it as a structured JSON object:
        
        1. League name
        2. League ID (from the URL - it's the number after /league/ in the URL)
        3. Current standings (for each team: team name, owner, wins, losses, ties, points for, points against, current rank)
        4. Scoring format (Standard, PPR, Half-PPR, etc., from league settings)
        5. Current or most recent week matchups and scores (for each matchup: week, team1 ID, team1 score, team2 ID, team2 score)
        6. League settings (roster positions, playoff format, trade deadline, waiver type)
        7. All team rosters with player names, positions, NFL teams, and status (e.g., Active, Injured, Bye)
        
        If the league is private or inaccessible, return an error message in the 'error' field and set 'success' to false.
        
        Return the data in this exact JSON format:
        {
          "success": true,
          "error": null,
          "data": {
            "league_name": "League Name",
            "league_id": "extracted from URL",
            "scoring_format": "PPR/Standard/Half-PPR",
            "teams": [
              {
                "team_id": "unique_identifier_for_team",
                "team_name": "Team Name",
                "owner": "Owner Name",
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "points_for": 0,
                "points_against": 0,
                "rank": 1,
                "roster": [
                  {
                    "player_name": "Player Name",
                    "position": "QB/RB/WR/TE/K/DEF",
                    "nfl_team": "Team Abbreviation",
                    "status": "Active/Injured/Bye"
                  }
                ]
              }
            ],
            "matchups": [
              {
                "week": 1,
                "team1_id": "team_identifier_1",
                "team1_score": 0,
                "team2_id": "team_identifier_2", 
                "team2_score": 0
              }
            ],
            "league_settings": {
              "roster_positions": "1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 K, 1 DEF",
              "playoff_format": "Weeks 15-17",
              "trade_deadline": "Week 10",
              "waiver_type": "Waivers"
            }
          }
        }
      `;

      const result = await InvokeLLM({
        prompt: scrapingPrompt,
        add_context_from_internet: true, // Allow LLM to access the internet to scrape
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string", nullable: true },
            data: {
              type: "object",
              properties: {
                league_name: { type: "string" },
                league_id: { type: "string" },
                scoring_format: { type: "string" },
                teams: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      team_id: { type: "string" },
                      team_name: { type: "string" },
                      owner: { type: "string" },
                      wins: { type: "number" },
                      losses: { type: "number" },
                      ties: { type: "number" },
                      points_for: { type: "number" },
                      points_against: { type: "number" },
                      rank: { type: "number" },
                      roster: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            player_name: { type: "string" },
                            position: { type: "string" },
                            nfl_team: { type: "string" },
                            status: { type: "string" }
                          },
                          required: ["player_name", "position", "nfl_team"]
                        }
                      }
                    },
                    required: ["team_id", "team_name", "wins", "losses", "points_for", "rank", "roster"]
                  }
                },
                matchups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      week: { type: "number" },
                      team1_id: { type: "string" },
                      team1_score: { type: "number" },
                      team2_id: { type: "string" },
                      team2_score: { type: "number" }
                    },
                    required: ["week", "team1_id", "team1_score", "team2_id", "team2_score"]
                  }
                },
                league_settings: {
                  type: "object",
                  properties: {
                    roster_positions: { type: "string" },
                    playoff_format: { type: "string" },
                    trade_deadline: { type: "string" },
                    waiver_type: { type: "string" }
                  }
                }
              },
              required: ["league_name", "league_id", "scoring_format", "teams", "matchups", "league_settings"]
            }
          },
          required: ["success", "data"]
        }
      });

      return result;
    } catch (error) {
      console.error("Error scraping NFL league data:", error);
      return {
        success: false,
        error: "Failed to scrape league data. This might be due to an invalid URL, a private league, or a network issue. Please check the URL and try again.",
        data: null
      };
    }
  };

  const handleAddConnection = async () => {
    setIsLoading(true);
    try {
      if (selectedPlatform === 'nfl') {
        if (!formData.league_url) {
          alert("Please provide the NFL.com League URL.");
          setIsLoading(false);
          return;
        }
        
        // Basic URL validation
        if (!formData.league_url.includes('fantasy.nfl.com/league/')) {
          alert("Please provide a valid NFL.com fantasy league URL (e.g., https://fantasy.nfl.com/league/1234567).");
          setIsLoading(false);
          return;
        }

        if (!formData.username) {
            alert("Please provide your team name or owner name to identify your team in the league.");
            setIsLoading(false);
            return;
        }
        
        // Scrape the NFL league data using the LLM
        const scrapingResult = await scrapeNFLLeagueData(formData.league_url);

        if (scrapingResult.success && scrapingResult.data) {
          const leagueData = scrapingResult.data;
          
          // Try to identify user's team by username (team name or owner name)
          // Make sure team_id in scraped data is unique and consistent for lookups
          const userTeam = leagueData.teams.find(team => 
            team.team_name.toLowerCase() === formData.username.toLowerCase() ||
            (team.owner && team.owner.toLowerCase() === formData.username.toLowerCase())
          );

          if (!userTeam) {
              alert(`Could not find a team matching "${formData.username}" in the league. Please ensure your team name or owner name is accurate.`);
              setIsLoading(false);
              return;
          }

          const newConnection = {
            platform: "nfl",
            league_id: leagueData.league_id,
            league_name: leagueData.league_name,
            username: formData.username, // From form
            team_name: userTeam.team_name,
            connection_status: "active",
            last_sync: new Date().toISOString(),
            league_settings: {
              scoring_format: leagueData.scoring_format?.toLowerCase() || "unknown",
              roster_format: leagueData.league_settings?.roster_positions || "Standard NFL.com Roster",
              playoff_format: leagueData.league_settings?.playoff_format || "Standard NFL.com Playoff",
              waiver_type: leagueData.league_settings?.waiver_type || "Waivers",
              trade_deadline: leagueData.league_settings?.trade_deadline || "N/A"
            },
            current_season_data: {
              wins: userTeam.wins || 0,
              losses: userTeam.losses || 0,
              ties: userTeam.ties || 0,
              points_for: userTeam.points_for || 0,
              points_against: userTeam.points_against || 0,
              current_rank: userTeam.rank || 0,
              weekly_scores: leagueData.matchups
                .filter(m => m.team1_id === userTeam.team_id || m.team2_id === userTeam.team_id)
                .map(m => {
                  const isTeam1 = m.team1_id === userTeam.team_id;
                  const opponentTeam = leagueData.teams.find(t => t.team_id === (isTeam1 ? m.team2_id : m.team1_id));
                  return {
                    week: m.week,
                    score: isTeam1 ? m.team1_score : m.team2_score,
                    opponent: opponentTeam ? opponentTeam.team_name : `Team ${isTeam1 ? m.team2_id : m.team1_id}`,
                    result: (isTeam1 && m.team1_score > m.team2_score) || (!isTeam1 && m.team2_score > m.team1_score) ? 'W' : 'L'
                  };
                })
            },
            roster_data: {
              current_roster: userTeam.roster || [],
              recent_transactions: [] // LLM doesn't easily scrape transactions, so leaving empty for now
            }
          };

          await LeagueConnection.create(newConnection);
        } else {
          alert(`Import failed: ${scrapingResult.error || "Unknown error during data scraping."}`);
        }
      } else if (selectedPlatform === 'yahoo') {
        if (!formData.league_url) {
          alert("Please provide the Yahoo Fantasy League URL.");
          setIsLoading(false);
          return;
        }
        
        // Basic URL validation for Yahoo
        if (!formData.league_url.includes('football.fantasysports.yahoo.com/f1/')) {
          alert("Please provide a valid Yahoo Fantasy league URL (e.g., https://football.fantasysports.yahoo.com/f1/1234567).");
          setIsLoading(false);
          return;
        }

        if (!formData.username) {
          alert("Please provide your team name or owner name to identify your team in the league.");
          setIsLoading(false);
          return;
        }
        
        // Scrape the Yahoo league data using the LLM
        const scrapingResult = await scrapeYahooLeagueData(formData.league_url);

        if (scrapingResult.success && scrapingResult.data) {
          const leagueData = scrapingResult.data;
          
          // Try to identify user's team by username (team name or owner name)
          const userTeam = leagueData.teams.find(team => 
            team.team_name.toLowerCase() === formData.username.toLowerCase() ||
            (team.owner && team.owner.toLowerCase() === formData.username.toLowerCase())
          );

          if (!userTeam) {
            alert(`Could not find a team matching "${formData.username}" in the league. Please ensure your team name or owner name is accurate.`);
            setIsLoading(false);
            return;
          }

          const newConnection = {
            platform: "yahoo",
            league_id: leagueData.league_id,
            league_name: leagueData.league_name,
            username: formData.username,
            team_name: userTeam.team_name,
            connection_status: "active",
            last_sync: new Date().toISOString(),
            league_settings: {
              scoring_format: leagueData.scoring_format?.toLowerCase() || "unknown",
              roster_format: leagueData.league_settings?.roster_positions || "Standard Yahoo Roster",
              playoff_format: leagueData.league_settings?.playoff_format || "Standard Yahoo Playoff",
              waiver_type: leagueData.league_settings?.waiver_type || "Waivers",
              trade_deadline: leagueData.league_settings?.trade_deadline || "N/A"
            },
            current_season_data: {
              wins: userTeam.wins || 0,
              losses: userTeam.losses || 0,
              ties: userTeam.ties || 0,
              points_for: userTeam.points_for || 0,
              points_against: userTeam.points_against || 0,
              current_rank: userTeam.rank || 0,
              weekly_scores: leagueData.matchups
                .filter(m => m.team1_id === userTeam.team_id || m.team2_id === userTeam.team_id)
                .map(m => {
                  const isTeam1 = m.team1_id === userTeam.team_id;
                  const opponentTeam = leagueData.teams.find(t => t.team_id === (isTeam1 ? m.team2_id : m.team1_id));
                  return {
                    week: m.week,
                    score: isTeam1 ? m.team1_score : m.team2_score,
                    opponent: opponentTeam ? opponentTeam.team_name : `Team ${isTeam1 ? m.team2_id : m.team1_id}`,
                    result: (isTeam1 && m.team1_score > m.team2_score) || (!isTeam1 && m.team2_score > m.team1_score) ? 'W' : 'L'
                  };
                })
            },
            roster_data: {
              current_roster: userTeam.roster || [],
              recent_transactions: []
            }
          };

          await LeagueConnection.create(newConnection);
        } else {
          alert(`Import failed: ${scrapingResult.error || "Unknown error during data scraping."}`);
        }
      } else { // Existing logic for other platforms
        if (!selectedPlatform || !formData.username || !formData.league_name || !formData.league_id) {
          alert("Please fill in all required fields for this platform.");
          setIsLoading(false);
          return;
        }

        const validationResult = await simulateLeagueValidation(selectedPlatform, formData);
        
        if (validationResult.success) {
          const newConnection = {
            platform: selectedPlatform,
            league_id: formData.league_id,
            league_name: formData.league_name,
            username: formData.username,
            team_name: formData.team_name,
            connection_status: "active",
            last_sync: new Date().toISOString(),
            league_settings: validationResult.league_settings,
            current_season_data: validationResult.season_data,
            roster_data: validationResult.roster_data
          };
          
          await LeagueConnection.create(newConnection);
        } else {
          alert(`Connection failed: ${validationResult.error}`);
        }
      }
      
      await loadData();
      resetForm();
    } catch (error) {
      console.error("Error adding connection:", error);
      alert("Failed to connect league. Please check your information and try again. Error: " + error.message);
    }
    setIsLoading(false);
  };
  
  // Removed simulateNFLDataFetch as it's replaced by scrapeNFLLeagueData

  const simulateLeagueValidation = async (platform, data) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different validation outcomes
    if (data.league_id.length < 6) {
      return { success: false, error: "Invalid league ID format" };
    }
    
    // Simulate successful connection with mock data
    return {
      success: true,
      league_settings: {
        scoring_format: "ppr",
        roster_format: "1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 DEF, 1 K",
        playoff_format: "6 team playoff (weeks 15-17)",
        trade_deadline: "2024-11-15",
        waiver_type: "FAAB"
      },
      season_data: {
        wins: Math.floor(Math.random() * 8) + 1,
        losses: Math.floor(Math.random() * 6) + 1,
        ties: 0,
        points_for: Math.floor(Math.random() * 500) + 1200,
        points_against: Math.floor(Math.random() * 500) + 1100,
        current_rank: Math.floor(Math.random() * 10) + 1,
        weekly_scores: generateMockWeeklyScores()
      },
      roster_data: {
        current_roster: generateMockRoster(),
        recent_transactions: generateMockTransactions()
      }
    };
  };

  const generateMockWeeklyScores = () => {
    const scores = [];
    for (let i = 1; i <= 8; i++) {
      scores.push({
        week: i,
        score: Math.floor(Math.random() * 50) + 80,
        opponent: `Team ${Math.floor(Math.random() * 9) + 1}`,
        result: Math.random() > 0.5 ? "W" : "L"
      });
    }
    return scores;
  };

  const generateMockRoster = () => [
    { player_name: "Josh Allen", position: "QB", team: "BUF", status: "Healthy" },
    { player_name: "Christian McCaffrey", position: "RB", team: "SF", status: "Healthy" },
    { player_name: "Saquon Barkley", position: "RB", team: "PHI", status: "Healthy" },
    { player_name: "Tyreek Hill", position: "WR", team: "MIA", status: "Healthy" },
    { player_name: "CeeDee Lamb", position: "WR", team: "DAL", status: "Questionable" },
    { player_name: "Travis Kelce", position: "TE", team: "KC", status: "Healthy" },
    { player_name: "49ers", position: "DEF", team: "SF", status: "Healthy" }
  ];

  const generateMockTransactions = () => [
    { type: "waiver", player_name: "Jayden Daniels", date: "2024-01-15", details: "Added from waivers" },
    { type: "trade", player_name: "Davante Adams", date: "2024-01-10", details: "Traded for DeAndre Hopkins + 2025 2nd" },
    { type: "free_agent", player_name: "Tyler Boyd", date: "2024-01-08", details: "Added as free agent" }
  ];

  const handleRemoveConnection = async (connectionId) => {
    try {
      await LeagueConnection.delete(connectionId);
      await loadData();
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  const handleRefreshConnection = async (connectionId) => {
    setRefreshing({ ...refreshing, [connectionId]: true });
    
    try {
      // Short delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const connection = connections.find(c => c.id === connectionId);
      if (connection) {
        let updatedData = { success: false }; // Default to failure

        if (connection.platform === 'nfl') {
          // Re-scrape NFL data for refresh
          // Construct the league URL based on stored league_id (assuming the ID is sufficient to reconstruct the URL)
          const leagueUrl = `https://fantasy.nfl.com/league/${connection.league_id}`;
          const scrapingResult = await scrapeNFLLeagueData(leagueUrl);
          
          if (scrapingResult.success && scrapingResult.data) {
            const leagueData = scrapingResult.data;
            // Find the user's team again based on the stored team name
            const userTeam = leagueData.teams.find(team => 
                team.team_name === connection.team_name || 
                (team.owner && team.owner === connection.username) // Also check owner if available
            );

            if (userTeam) {
                updatedData = {
                    success: true,
                    current_season_data: {
                        wins: userTeam.wins || 0,
                        losses: userTeam.losses || 0,
                        ties: userTeam.ties || 0,
                        points_for: userTeam.points_for || 0,
                        points_against: userTeam.points_against || 0,
                        current_rank: userTeam.rank || 0,
                        weekly_scores: leagueData.matchups
                            .filter(m => m.team1_id === userTeam.team_id || m.team2_id === userTeam.team_id)
                            .map(m => {
                                const isTeam1 = m.team1_id === userTeam.team_id;
                                const opponentTeam = leagueData.teams.find(t => t.team_id === (isTeam1 ? m.team2_id : m.team1_id));
                                return {
                                    week: m.week,
                                    score: isTeam1 ? m.team1_score : m.team2_score,
                                    opponent: opponentTeam ? opponentTeam.team_name : `Team ${isTeam1 ? m.team2_id : m.team1_id}`,
                                    result: (isTeam1 && m.team1_score > m.team2_score) || (!isTeam1 && m.team2_score > m.team1_score) ? 'W' : 'L'
                                };
                            })
                    },
                    roster_data: {
                        current_roster: userTeam.roster || [],
                        recent_transactions: [] // As before, transactions might not be scraped
                    }
                };
            } else {
                // If user's team not found during refresh, it might be an issue.
                updatedData.error = "Your team could not be identified in the refreshed league data.";
            }
          } else {
            updatedData.error = scrapingResult.error || 'Failed to re-scrape NFL data.';
          }
        } else if (connection.platform === 'yahoo') {
          // Re-scrape Yahoo data for refresh
          const leagueUrl = `https://football.fantasysports.yahoo.com/f1/${connection.league_id}`;
          const scrapingResult = await scrapeYahooLeagueData(leagueUrl);
          
          if (scrapingResult.success && scrapingResult.data) {
            const leagueData = scrapingResult.data;
            const userTeam = leagueData.teams.find(team => 
                team.team_name === connection.team_name || 
                (team.owner && team.owner === connection.username)
            );

            if (userTeam) {
              updatedData = {
                success: true,
                current_season_data: {
                  wins: userTeam.wins || 0,
                  losses: userTeam.losses || 0,
                  ties: userTeam.ties || 0,
                  points_for: userTeam.points_for || 0,
                  points_against: userTeam.points_against || 0,
                  current_rank: userTeam.rank || 0,
                  weekly_scores: leagueData.matchups
                    .filter(m => m.team1_id === userTeam.team_id || m.team2_id === userTeam.team_id)
                    .map(m => {
                      const isTeam1 = m.team1_id === userTeam.team_id;
                      const opponentTeam = leagueData.teams.find(t => t.team_id === (isTeam1 ? m.team2_id : m.team1_id));
                      return {
                        week: m.week,
                        score: isTeam1 ? m.team1_score : m.team2_score,
                        opponent: opponentTeam ? opponentTeam.team_name : `Team ${isTeam1 ? m.team2_id : m.team1_id}`,
                        result: (isTeam1 && m.team1_score > m.team2_score) || (!isTeam1 && m.team2_score > m.team1_score) ? 'W' : 'L'
                      };
                    })
                },
                roster_data: {
                  current_roster: userTeam.roster || [],
                  recent_transactions: []
                }
              };
            } else {
              updatedData.error = "Your team could not be identified in the refreshed league data.";
            }
          } else {
            updatedData.error = scrapingResult.error || 'Failed to re-scrape Yahoo data.';
          }
        } else {
          updatedData = await simulateLeagueValidation(connection.platform, {
            league_id: connection.league_id,
            username: connection.username,
            league_name: connection.league_name,
            team_name: connection.team_name
          });
        }
        
        if (updatedData.success) {
            await LeagueConnection.update(connectionId, {
              last_sync: new Date().toISOString(),
              current_season_data: updatedData.current_season_data,
              roster_data: updatedData.roster_data,
              connection_status: "active" // Set to active on successful refresh
            });
            await loadData();
        } else {
          console.warn(`Refresh failed for connection ${connectionId}: ${updatedData.error || 'Unknown error'}`);
          await LeagueConnection.update(connectionId, { connection_status: 'error' }); // Set to error on failed refresh
          await loadData();
        }
      }
    } catch (error) {
      console.error("Error refreshing connection:", error);
      const connection = connections.find(c => c.id === connectionId);
      if (connection) {
        await LeagueConnection.update(connectionId, { connection_status: 'error' });
        await loadData();
      }
    }
    
    setRefreshing({ ...refreshing, [connectionId]: false });
  };

  const resetForm = () => {
    setShowAddForm(false);
    setSelectedPlatform("");
    setFormData({ username: "", league_name: "", league_id: "", team_name: "", league_url: "" });
  };

  const getPlatformInfo = (platformId) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };

  const getOverallStats = () => {
    if (connections.length === 0) return { totalWins: 0, totalLosses: 0, avgRank: 0, totalPoints: 0 };
    
    let totalWins = 0, totalLosses = 0, totalRank = 0, totalPoints = 0;
    let validRanks = 0;
    
    connections.forEach(conn => {
      const data = conn.current_season_data || {};
      totalWins += data.wins || 0;
      totalLosses += data.losses || 0;
      totalPoints += data.points_for || 0;
      if (data.current_rank && data.current_rank > 0 && data.current_rank !== Infinity) { // Only count valid ranks
        totalRank += data.current_rank;
        validRanks++;
      }
    });
    
    return {
      totalWins,
      totalLosses,
      avgRank: validRanks > 0 ? Math.round(totalRank / validRanks) : 0,
      totalPoints: Math.round(totalPoints)
    };
  };

  const stats = getOverallStats();

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
          
          .neo-brutal-input {
            border: 3px solid #000000 !important;
            box-shadow: 3px 3px 0px #000000 !important;
          }
          
          .platform-button {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
            cursor: pointer;
          }
          
          .platform-button:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }
          
          .platform-button.selected {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px #000000;
          }
          
          .connection-card {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
          }
        `}
      </style>

      <TooltipProvider>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-black mb-2 transform -rotate-1">
              LEAGUE CONNECTIONS
            </h1>
            <p className="text-xl font-bold text-gray-600">
              Connect your real fantasy leagues for live tracking and personalized insights
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="neo-brutal-card bg-blue-500 text-white p-6 transform rotate-1">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8" />
                <span className="text-3xl font-black">{stats.totalWins}-{stats.totalLosses}</span>
              </div>
              <h3 className="font-black text-lg">OVERALL RECORD</h3>
              <p className="font-bold text-sm opacity-90">Across all leagues</p>
            </div>

            <div className="neo-brutal-card bg-orange-500 text-white p-6 transform -rotate-1">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8" />
                <span className="text-3xl font-black">{stats.avgRank > 0 ? `#${stats.avgRank}` : 'N/A'}</span>
              </div>
              <h3 className="font-black text-lg">AVG RANKING</h3>
              <p className="font-bold text-sm opacity-90">Current position</p>
            </div>

            <div className="neo-brutal-card bg-green-500 text-white p-6 transform rotate-1">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-2xl font-black">{stats.totalPoints.toLocaleString()}</span>
              </div>
              <h3 className="font-black text-lg">TOTAL POINTS</h3>
              <p className="font-bold text-sm opacity-90">Points scored</p>
            </div>

            <div className="neo-brutal-card bg-purple-500 text-white p-6 transform -rotate-1">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" />
                <span className="text-3xl font-black">{connections.length}</span>
              </div>
              <h3 className="font-black text-lg">CONNECTED</h3>
              <p className="font-bold text-sm opacity-90">Active leagues</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Connected Leagues */}
            <div className="lg:col-span-2">
              <div className="neo-brutal-card bg-white p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black">YOUR LEAGUES</h2>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    CONNECT LEAGUE
                  </Button>
                </div>

                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-black text-gray-600 mb-2">NO LEAGUES CONNECTED</h3>
                    <p className="font-bold text-gray-500 mb-6">
                      Connect your real fantasy leagues to get live tracking and personalized training
                    </p>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black"
                    >
                      CONNECT YOUR FIRST LEAGUE
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {connections.map((connection) => {
                      const platform = getPlatformInfo(connection.platform);
                      const seasonData = connection.current_season_data || {};
                      const rosterData = connection.roster_data || {};
                      
                      return (
                        <div key={connection.id} className="connection-card p-6 bg-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 ${platform.color} rounded-lg flex items-center justify-center border-3 border-black`}>
                                <span className="text-3xl">{platform.logo}</span>
                              </div>
                              <div>
                                <h3 className="font-black text-xl">{connection.league_name}</h3>
                                <p className="font-bold text-gray-600">{connection.team_name || connection.username}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={`${
                                    connection.connection_status === 'active' ? 'bg-green-500' : 
                                    connection.connection_status === 'error' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  } text-white font-bold`}>
                                    {connection.connection_status.toUpperCase()}
                                  </Badge>
                                  <span className="text-sm font-bold text-gray-500">
                                    Last sync: {new Date(connection.last_sync).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRefreshConnection(connection.id)}
                                    disabled={refreshing[connection.id]}
                                    className="text-blue-600 hover:bg-blue-50"
                                  >
                                    <RefreshCw className={`w-4 h-4 ${refreshing[connection.id] ? 'animate-spin' : ''}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Refresh league data</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:bg-gray-100"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View on {platform.name}</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveConnection(connection.id)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove connection</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          {/* League Stats */}
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="neo-brutal-card bg-white p-3">
                              <div className="text-center">
                                <div className="font-black text-2xl text-blue-600">{seasonData.wins || 0}-{seasonData.losses || 0}</div>
                                <div className="font-bold text-sm text-gray-600">Record</div>
                              </div>
                            </div>
                            
                            <div className="neo-brutal-card bg-white p-3">
                              <div className="text-center">
                                <div className="font-black text-2xl text-orange-600">#{seasonData.current_rank || 'N/A'}</div>
                                <div className="font-bold text-sm text-gray-600">Rank</div>
                              </div>
                            </div>
                            
                            <div className="neo-brutal-card bg-white p-3">
                              <div className="text-center">
                                <div className="font-black text-lg text-green-600">{seasonData.points_for || 0}</div>
                                <div className="font-bold text-sm text-gray-600">Points For</div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity */}
                          {rosterData.recent_transactions && rosterData.recent_transactions.length > 0 && (
                            <div>
                              <h4 className="font-black text-sm mb-2">RECENT ACTIVITY</h4>
                              <div className="space-y-1">
                                {rosterData.recent_transactions.slice(0, 3).map((transaction, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Activity className="w-3 h-3" />
                                    <span className="font-bold">{transaction.player_name}</span>
                                    <span className="font-bold text-gray-600">- {transaction.details}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="neo-brutal-card bg-yellow-300 p-6 transform -rotate-1">
                <h3 className="text-lg font-black mb-4">LEAGUE INSIGHTS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Win Rate:</span>
                    <span className="font-black">
                      {stats.totalWins + stats.totalLosses > 0 
                        ? Math.round((stats.totalWins / (stats.totalWins + stats.totalLosses)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Best Rank:</span>
                    <span className="font-black">
                      {connections.length > 0 && connections.some(c => c.current_season_data?.current_rank && c.current_season_data.current_rank > 0)
                        ? `#${Math.min(...connections.filter(c => c.current_season_data?.current_rank && c.current_season_data.current_rank > 0).map(c => c.current_season_data.current_rank))}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Avg Points/Week:</span>
                    <span className="font-black">
                      {connections.length > 0 
                        ? Math.round(stats.totalPoints / (connections.length * 8)) // Assuming 8 weeks for mock data
                        : 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Training Recommendations */}
              <div className="neo-brutal-card bg-pink-100 p-6">
                <h3 className="text-lg font-black mb-4">RECOMMENDED TRAINING</h3>
                <div className="space-y-3">
                  {stats.avgRank > 6 && (
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-orange-500 mt-1" />
                      <div>
                        <p className="font-black text-sm">IMPROVE RANKINGS</p>
                        <p className="font-bold text-xs text-gray-600">Focus on waiver wire and trade strategies</p>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalWins + stats.totalLosses > 0 && (stats.totalWins / (stats.totalWins + stats.totalLosses) < 0.5) && (
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-1" />
                      <div>
                        <p className="font-black text-sm">WIN MORE GAMES</p>
                        <p className="font-bold text-xs text-gray-600">Work on lineup optimization</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <Trophy className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-black text-sm">PLAYOFF PREP</p>
                      <p className="font-bold text-xs text-gray-600">Learn championship strategies</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Help */}
              <div className="neo-brutal-card bg-blue-100 p-6 transform rotate-1">
                <h3 className="text-lg font-black mb-3">NEED HELP CONNECTING?</h3>
                <p className="font-bold text-sm text-gray-600 mb-4">
                  Having trouble finding your league ID or connecting your account?
                </p>
                <Button 
                  onClick={() => setShowConnectionGuide(true)}
                  className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black w-full"
                >
                  VIEW GUIDE
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Connection Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">CONNECT FANTASY LEAGUE</DialogTitle>
              <DialogDescription className="font-bold text-gray-600">
                Select your fantasy platform and provide the necessary information. For NFL.com and Yahoo, just paste your league URL.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 p-4">
              <div>
                <label className="block font-black text-sm mb-3">SELECT PLATFORM</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`platform-button ${selectedPlatform === platform.id ? 'selected' : ''} p-4 ${platform.color} text-white cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.logo}</span>
                        <div>
                          <h4 className="font-black text-sm">{platform.name}</h4>
                          <p className="font-bold text-xs opacity-90">{platform.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedPlatform === 'nfl' || selectedPlatform === 'yahoo') && (
                 <div className="space-y-4">
                    <div>
                      <label className="block font-black text-sm mb-2">
                        {selectedPlatform === 'nfl' ? 'NFL.com LEAGUE URL *' : 'YAHOO FANTASY LEAGUE URL *'}
                      </label>
                      <Input
                        value={formData.league_url}
                        onChange={(e) => setFormData({...formData, league_url: e.target.value})}
                        placeholder={
                          selectedPlatform === 'nfl' 
                            ? "https://fantasy.nfl.com/league/1234567"
                            : "https://football.fantasysports.yahoo.com/f1/1234567"
                        }
                        className="neo-brutal-input font-bold"
                      />
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        Make sure your league is public or accessible
                      </p>
                    </div>
                    
                    <div>
                      <label className="block font-black text-sm mb-2">YOUR USERNAME/TEAM IDENTIFIER *</label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="Your team name or owner name"
                        className="neo-brutal-input font-bold"
                      />
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        This helps us identify your team in the league
                      </p>
                    </div>
                 </div>
              )}

              {selectedPlatform && !['nfl', 'yahoo'].includes(selectedPlatform) && (
                <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-black text-sm mb-2">LEAGUE ID *</label>
                            <Input
                            value={formData.league_id}
                            onChange={(e) => setFormData({...formData, league_id: e.target.value})}
                            placeholder="e.g. 123456789"
                            className="neo-brutal-input font-bold"
                            />
                            <p className="text-xs font-bold text-gray-500 mt-1">Find this in your league URL</p>
                        </div>
                        <div>
                            <label className="block font-black text-sm mb-2">YOUR USERNAME *</label>
                            <Input
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            placeholder="Your platform username"
                            className="neo-brutal-input font-bold"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-black text-sm mb-2">LEAGUE NAME *</label>
                            <Input
                            value={formData.league_name}
                            onChange={(e) => setFormData({...formData, league_name: e.target.value})}
                            placeholder="Your league name"
                            className="neo-brutal-input font-bold"
                            />
                        </div>
                        <div>
                            <label className="block font-black text-sm mb-2">TEAM NAME</label>
                            <Input
                            value={formData.team_name}
                            onChange={(e) => setFormData({...formData, team_name: e.target.value})}
                            placeholder="Your team name (optional)"
                            className="neo-brutal-input font-bold"
                            />
                        </div>
                    </div>
                </>
              )}


              {selectedPlatform && (
                <div className="neo-brutal-card bg-yellow-100 p-4">
                  <h4 className="font-black mb-2">CONNECTION GUIDE</h4>
                  <p className="font-bold text-sm">
                    {platforms.find(p => p.id === selectedPlatform)?.connection_guide}
                  </p>
                  {(selectedPlatform === 'nfl' || selectedPlatform === 'yahoo') && (
                    <div className="mt-3 p-3 bg-blue-100 border-2 border-black">
                      <p className="font-black text-xs mb-1">IMPORTANT:</p>
                      <p className="font-bold text-xs">
                        • Your {selectedPlatform === 'nfl' ? 'NFL.com' : 'Yahoo'} fantasy league must be public or have public standings<br/>
                        • Private leagues cannot be imported<br/>
                        • We only read public data, no login required
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleAddConnection}
                  disabled={
                    !selectedPlatform || isLoading ||
                    (['nfl', 'yahoo'].includes(selectedPlatform) && (!formData.league_url || !formData.username)) ||
                    (!['nfl', 'yahoo'].includes(selectedPlatform) && (!formData.username || !formData.league_name || !formData.league_id))
                  }
                  className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {['nfl', 'yahoo'].includes(selectedPlatform) ? 'IMPORTING DATA...' : 'CONNECTING...'}
                    </>
                  ) : (
                    'CONNECT LEAGUE'
                  )}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="neo-brutal-button bg-white text-black font-black"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Connection Guide Dialog */}
        <Dialog open={showConnectionGuide} onOpenChange={setShowConnectionGuide}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">HOW TO FIND YOUR LEAGUE ID</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 p-4">
              {platforms.map(platform => (
                <div key={platform.id} className="neo-brutal-card bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center border-2 border-black`}>
                      <span className="text-xl">{platform.logo}</span>
                    </div>
                    <h3 className="font-black text-lg">{platform.name}</h3>
                  </div>
                  <p className="font-bold text-sm">{platform.connection_guide}</p>
                </div>
              ))}
              
              <div className="neo-brutal-card bg-red-100 p-4">
                <h4 className="font-black mb-2">IMPORTANT NOTES</h4>
                <ul className="text-sm font-bold space-y-1 list-disc pl-4">
                  <li>Your league must be public or you must be a member</li>
                  <li>Some platforms may require additional authentication</li>
                  <li>Data syncs every hour automatically</li>
                  <li>Remove connections anytime from your settings</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </div>
  );
}
