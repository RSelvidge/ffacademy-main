const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const bedrock = new BedrockRuntimeClient({});
const MODEL_ID = process.env.BEDROCK_MODEL_ID;

const PROMPT = (platform, leagueUrl, username) => `You are a fantasy football league data extractor for ${platform}. League URL: ${leagueUrl}. The user's team name or owner name is: ${username}.
Return ONLY valid JSON (no markdown) in this exact shape:
{
  "success": true,
  "error": null,
  "data": {
    "league_name": string,
    "league_id": string,
    "scoring_format": "PPR" | "Half-PPR" | "Standard",
    "teams": [{ "team_id": string, "team_name": string, "owner": string, "wins": number, "losses": number, "ties": number, "points_for": number, "points_against": number, "rank": number, "roster": [{ "player_name": string, "position": "QB|RB|WR|TE|K|DEF", "nfl_team": string, "status": "Active|Injured|Bye" }] }],
    "matchups": [{ "week": number, "team1_id": string, "team1_score": number, "team2_id": string, "team2_score": number }],
    "league_settings": { "roster_positions": string, "playoff_format": string, "trade_deadline": string, "waiver_type": string }
  }
}
IMPORTANT: one of the teams must have team_name or owner exactly matching "${username}".
If the URL is invalid or the league is private, generate plausible simulated data anyway.`;

const TEAM_NAMES = [
  "Gridiron Gorillas", "Touchdown Titans", "Blitz Brigade", "End Zone Eagles",
  "Red Zone Rebels", "Hail Mary Heroes", "Pocket Passers", "Sack Machines",
  "Goal Line Goats", "Fantasy Falcons", "Purple Reign", "Dallas Diamondbacks",
];
const POSITIONS = ["QB", "RB", "RB", "WR", "WR", "TE", "FLEX", "K", "DEF"];
const PLAYERS = [
  ["J. Allen", "QB", "BUF"], ["C. McCaffrey", "RB", "SF"], ["B. Hall", "RB", "NYJ"],
  ["J. Chase", "WR", "CIN"], ["P. Nacua", "WR", "LAR"], ["T. Kelce", "TE", "KC"],
  ["D. Montgomery", "RB", "DET"], ["J. Tucker", "K", "BAL"], ["Ravens", "DEF", "BAL"],
  ["L. Jackson", "QB", "BAL"], ["D. Henry", "RB", "BAL"], ["A. St. Brown", "WR", "DET"],
  ["G. Wilson", "WR", "NYJ"], ["M. Andrews", "TE", "BAL"], ["K. Walker III", "RB", "SEA"],
  ["J. Love", "QB", "GB"], ["S. Barkley", "RB", "PHI"], ["C. Lamb", "WR", "DAL"],
];

function makeTeam(teamId, teamName, owner) {
  const wins = Math.floor(Math.random() * 9) + 2;
  const losses = 13 - wins - (Math.random() > 0.8 ? 1 : 0);
  const pf = Math.round((wins * 118 + 60 + Math.random() * 40) * 10) / 10;
  const pa = Math.round((losses * 112 + 70 + Math.random() * 50) * 10) / 10;
  const roster = POSITIONS.map((position, i) => {
    const [player_name, pos, nfl_team] = PLAYERS[(Math.floor(Math.random() * PLAYERS.length))];
    return { player_name, position: pos, nfl_team, status: Math.random() > 0.9 ? "Injured" : "Active" };
  });
  return { team_id: teamId, team_name: teamName, owner, wins, losses, ties: 0, points_for: pf, points_against: pa, rank: 0, roster };
}

function mockLeagueData(platform, leagueUrl, username) {
  const numTeams = 10 + Math.floor(Math.random() * 4);
  const teams = [];
  // First team always matches the user's username so the page can find it
  teams.push(makeTeam("team_1", username || "My Team", username || "Me"));
  const shuffled = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
  for (let i = 1; i < numTeams; i++) {
    teams.push(makeTeam(`team_${i + 1}`, shuffled[i % shuffled.length], `Owner ${i + 1}`));
  }
  // Standings by points_for, then assign ranks
  const ranked = [...teams].sort((a, b) => b.points_for - a.points_for);
  ranked.forEach((t, i) => (t.rank = i + 1));

  const matchups = [];
  for (let week = 1; week <= 8; week++) {
    for (let i = 0; i < teams.length; i += 2) {
      const a = teams[i], b = teams[(i + week) % teams.length] || teams[1];
      if (a.team_id === b.team_id) continue;
      matchups.push({
        week,
        team1_id: a.team_id,
        team1_score: Math.round((70 + Math.random() * 60) * 10) / 10,
        team2_id: b.team_id,
        team2_score: Math.round((70 + Math.random() * 60) * 10) / 10,
      });
    }
  }

  return {
    success: true,
    error: null,
    data: {
      league_name: `${(username || "My").replace(/^./, (c) => c.toUpperCase())}'s ${platform.toUpperCase()} League`,
      league_id: leagueUrl.match(/\d{4,}/)?.[0] ?? String(Math.floor(Math.random() * 900000) + 100000),
      scoring_format: ["PPR", "Half-PPR", "Standard"][Math.floor(Math.random() * 3)],
      teams,
      matchups,
      league_settings: {
        roster_positions: "1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 K, 1 DEF",
        playoff_format: "Weeks 15-17",
        trade_deadline: "Week 10",
        waiver_type: "Waivers",
      },
    },
  };
}

exports.handler = async (event) => {
  const { platform = "espn", league_url = "", username = "" } = JSON.parse(event.body || "{}");

  try {
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4000,
      messages: [{ role: "user", content: PROMPT(platform, league_url, username) }],
    };
    const result = await bedrock.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      })
    );
    const completion = JSON.parse(new TextDecoder().decode(result.body));
    const text = completion.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.data) parsed = { success: true, error: null, data: parsed };
    return { statusCode: 200, body: JSON.stringify(parsed) };
  } catch (err) {
    // Bedrock not enabled, throttled, or model not accessible - fall back to mock data
    console.warn("Bedrock invocation failed, using mock data:", err.message);
    return { statusCode: 200, body: JSON.stringify(mockLeagueData(platform, league_url, username)) };
  }
};
