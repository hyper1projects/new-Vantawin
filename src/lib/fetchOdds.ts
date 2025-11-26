  const API_KEY = 'c2d823601e1c78d3a0eaccd47cdbdfd4';

export async function fetchLiveGames() {
  const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds?regions=eu&markets=h2h,totals&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  function isGameLive(commenceTime: string, lastUpdate: string | undefined): boolean {
    const now = new Date();
    const start = new Date(commenceTime);
    const matchDurationMs = 3 * 60 * 60 * 1000; // 3 hours

    const inTimeWindow = now >= start && now <= new Date(start.getTime() + matchDurationMs);
    if (!inTimeWindow) return false;

    if (!lastUpdate) return inTimeWindow;

    const lastUpdateDate = new Date(lastUpdate);
    const freshnessMs = 5 * 60 * 1000; // 5 minutes

    return now.getTime() - lastUpdateDate.getTime() <= freshnessMs;
  }

  const games = data.map((game: any, index: number) => {
    const bookmaker = game.bookmakers[17]; // your chosen bookmaker

    const h2h = bookmaker?.markets.find((m: any) => m.key === "h2h");
    const totals = bookmaker?.markets.find((m: any) => m.key === "totals");
    const btts = bookmaker?.markets.find((m: any) => m.key === "btts");

    const lastUpdate = bookmaker?.last_update;

    const isLive = isGameLive(game.commence_time, lastUpdate);

    return {
      id: `game-${index + 1}`,
      time: new Date(game.commence_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(game.commence_time).toDateString(),
      team1: {
        name: game.home_team,
        logoIdentifier: game.home_team.substring(0, 3).toUpperCase(),
        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
      },
      team2: {
        name: game.away_team,
        logoIdentifier: game.away_team.substring(0, 3).toUpperCase(),
        abbreviation: game.away_team.substring(0, 3).toUpperCase(),
      },
      league: "Premier League",
      isLive,
      gameView: "View Game Details",
      questions: [
        {
          id: "full_time_result",
          type: "win_match",
          text: "What team will win this game?",
          odds: {
            team1: h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || null,
            draw: h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || null,
            team2: h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || null,
          },
        },
        totals
          ? {
              id: "over_2_5_goals_q",
              type: "over_2_5_goals",
              text: "Will there be 3 or more goals?",
              odds: {
                yes: totals.outcomes.find((o: any) => o.name === "Over")?.price,
                no: totals.outcomes.find((o: any) => o.name === "Under")?.price,
              },
            }
          : null,
        btts
          ? {
              id: "btts_q",
              type: "btts",
              text: "Will both teams score?",
              odds: {
                yes: btts.outcomes.find((o: any) => o.name === "Yes")?.price,
                no: btts.outcomes.find((o: any) => o.name === "No")?.price,
              },
            }
          : null,
      ].filter(Boolean),
    };
  });

  // Filter to return only live games
  return games.filter(game => game.isLive);
}
export async function fetchLaLigaGames() {
  const url = `https://api.the-odds-api.com/v4/sports/soccer_spain_la_liga/odds?regions=eu&markets=h2h,totals&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  function isGameLive(commenceTime: string, lastUpdate: string | undefined): boolean {
    const now = new Date();
    const start = new Date(commenceTime);
    const matchDurationMs = 3 * 60 * 60 * 1000; // 3 hours

    const inTimeWindow = now >= start && now <= new Date(start.getTime() + matchDurationMs);
    if (!inTimeWindow) return false;

    if (!lastUpdate) return inTimeWindow;

    const lastUpdateDate = new Date(lastUpdate);
    const freshnessMs = 5 * 60 * 1000; // 5 minutes

    return now.getTime() - lastUpdateDate.getTime() <= freshnessMs;
  }

  function isUpcomingWithinWeek(commenceTime: string): boolean {
    const now = new Date();
    const start = new Date(commenceTime);
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return start >= now && start <= oneWeekLater;
  }

  const games = data.map((game: any, index: number) => {
    // Pick your preferred bookmaker or the first available
    const bookmaker = game.bookmakers[17]; // fallback to first bookmaker

    const h2h = bookmaker?.markets.find((m: any) => m.key === "h2h");
    const totals = bookmaker?.markets.find((m: any) => m.key === "totals");
    const btts = bookmaker?.markets.find((m: any) => m.key === "btts");

    const lastUpdate = bookmaker?.last_update;

    const isLive = isGameLive(game.commence_time, lastUpdate);
    const isUpcoming = isUpcomingWithinWeek(game.commence_time);

    return {
      id: `game-${index + 1}`,
      time: new Date(game.commence_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(game.commence_time).toDateString(),
      team1: {
        name: game.home_team,
        logoIdentifier: game.home_team.substring(0, 3).toUpperCase(),
        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
      },
      team2: {
        name: game.away_team,
        logoIdentifier: game.away_team.substring(0, 3).toUpperCase(),
        abbreviation: game.away_team.substring(0, 3).toUpperCase(),
      },
      league: "La Liga",
      isLive,
      isUpcoming,
      gameView: "View Game Details",
      questions: [
        {
          id: "full_time_result",
          type: "win_match",
          text: "What team will win this game?",
          odds: {
            team1: h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || null,
            draw: h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || null,
            team2: h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || null,
          },
        },
        totals
          ? {
              id: "over_2_5_goals_q",
              type: "over_2_5_goals",
              text: "Will there be 3 or more goals?",
              odds: {
                yes: totals.outcomes.find((o: any) => o.name === "Over")?.price,
                no: totals.outcomes.find((o: any) => o.name === "Under")?.price,
              },
            }
          : null,
        btts
          ? {
              id: "btts_q",
              type: "btts",
              text: "Will both teams score?",
              odds: {
                yes: btts.outcomes.find((o: any) => o.name === "Yes")?.price,
                no: btts.outcomes.find((o: any) => o.name === "No")?.price,
              },
            }
          : null,
      ].filter(Boolean),
    };
  });

  // Return games that are live or upcoming within the week
  return games.filter(game => game.isLive || game.isUpcoming);
}
export async function fetchPremierLeagueGames() {
  const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds?regions=eu&markets=h2h,totals&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  // Helper to detect live games based on commence time and last update
  function isGameLive(commenceTime: string, lastUpdate: string | undefined): boolean {
    const now = new Date();
    const start = new Date(commenceTime);
    const matchDurationMs = 3 * 60 * 60 * 1000; // 3 hours

    const inTimeWindow = now >= start && now <= new Date(start.getTime() + matchDurationMs);
    if (!inTimeWindow) return false;

    if (!lastUpdate) return inTimeWindow;

    const lastUpdateDate = new Date(lastUpdate);
    const freshnessMs = 5 * 60 * 1000; // 5 minutes freshness window

    return now.getTime() - lastUpdateDate.getTime() <= freshnessMs;
  }

  // Map API data to your game model, including live score if available
  const games = data.map((game: any, index: number) => {
    const bookmaker = game.bookmakers[17]; // pick your preferred bookmaker here

    const h2h = bookmaker?.markets.find((m: any) => m.key === "h2h");
    const totals = bookmaker?.markets.find((m: any) => m.key === "totals");

    const lastUpdate = bookmaker?.last_update;
    const isLive = isGameLive(game.commence_time, lastUpdate);

    // Example of score extraction - update this based on your actual API response
    const homeScore = game.score?.home ?? null;
    const awayScore = game.score?.away ?? null;

    return {
      id: game.id || `game-${index + 1}`,
      time: new Date(game.commence_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(game.commence_time).toDateString(),
      team1: {
        name: game.home_team,
        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
      },
      team2: {
        name: game.away_team,
        abbreviation: game.away_team.substring(0, 3).toUpperCase(),
      },
      league: "Premier League",
      isLive,
      score: isLive ? { home: homeScore, away: awayScore } : null,  // include score only if live
      questions: [
        {
          id: "full_time_result",
          type: "win_match",
          text: "What team will win this game?",
          odds: {
            team1: h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || null,
            draw: h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || null,
            team2: h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || null,
          },
        },
        totals
          ? {
              id: "over_2_5_goals_q",
              type: "over_2_5_goals",
              text: "Will there be 3 or more goals?",
              odds: {
                yes: totals.outcomes.find((o: any) => o.name === "Over")?.price,
                no: totals.outcomes.find((o: any) => o.name === "Under")?.price,
              },
            }
          : null,
      ].filter(Boolean),
    };
  });

  return games;
}

export async function fetchChampionsLeagueGames() {
  const url = `https://api.the-odds-api.com/v4/sports/soccer_uefa_champs_league/odds?regions=eu&markets=h2h,totals&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  function isGameLive(commenceTime: string, lastUpdate: string | undefined): boolean {
    const now = new Date();
    const start = new Date(commenceTime);
    const matchDurationMs = 3 * 60 * 60 * 1000; // 3 hours

    const inTimeWindow = now >= start && now <= new Date(start.getTime() + matchDurationMs);
    if (!inTimeWindow) return false;

    if (!lastUpdate) return inTimeWindow;

    const lastUpdateDate = new Date(lastUpdate);
    const freshnessMs = 5 * 60 * 1000; // 5 minutes freshness window

    return now.getTime() - lastUpdateDate.getTime() <= freshnessMs;
  }

  return data.map((game: any, index: number) => {
    const bookmaker = game.bookmakers[17]; // Pick first bookmaker
    const lastUpdate = bookmaker?.last_update;
    const isLive = isGameLive(game.commence_time, lastUpdate);

    const h2h = bookmaker?.markets.find((m: any) => m.key === "h2h");
    const totals = bookmaker?.markets.find((m: any) => m.key === "totals");

    const homeScore = game.score?.home ?? null;
    const awayScore = game.score?.away ?? null;

    return {
      id: game.id || `game-${index + 1}`,
      time: new Date(game.commence_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(game.commence_time).toDateString(),
      team1: {
        name: game.home_team,
        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
      },
      team2: {
        name: game.away_team,
        abbreviation: game.away_team.substring(0, 3).toUpperCase(),
      },
      league: "Champions League",
      isLive,
      score: isLive ? { home: homeScore, away: awayScore } : null,
      questions: [
        {
          id: "full_time_result",
          type: "win_match",
          text: "What team will win this game?",
          odds: {
            team1: h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || null,
            draw: h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || null,
            team2: h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || null,
          },
        },
        totals
          ? {
              id: "over_2_5_goals_q",
              type: "over_2_5_goals",
              text: "Will there be 3 or more goals?",
              odds: {
                yes: totals.outcomes.find((o: any) => o.name === "Over")?.price,
                no: totals.outcomes.find((o: any) => o.name === "Under")?.price,
              },
            }
          : null,
      ].filter(Boolean),
    };
  });
}
