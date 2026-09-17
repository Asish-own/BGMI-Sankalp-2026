/**
 * BGMI Scoring Engine & Tie-Breaker Calculation Module
 */

export const POSITION_POINTS = {
  1: 6,
  2: 4,
  3: 2,
  4: 1,
  5: 1
};

export const KILL_POINT_MULTIPLIER = 2;

/**
 * Calculate score for a single match result
 */
export function calculateMatchScore(position, kills) {
  const posNum = parseInt(position, 10) || 0;
  const killNum = Math.max(0, parseInt(kills, 10) || 0);
  
  const positionBonus = POSITION_POINTS[posNum] || 0;
  const killPoints = killNum * KILL_POINT_MULTIPLIER;
  const matchScore = positionBonus + killPoints;

  return {
    positionBonus,
    killPoints,
    matchScore
  };
}

/**
 * Calculate overall tournament standings including penalty deductions & strict tie-breakers:
 * 1. Total Points (including penalty deductions) (descending)
 * 2. Total Kills (descending)
 * 3. 1st Place Finishes / WWCD count (descending)
 * 4. Highest Single Match Score (descending)
 * 5. Flag tiebreaker match needed if tied on all criteria
 * 
 * @param {Array} teams - Registered teams
 * @param {Array} matches - Completed matches list
 * @param {Array} penalties - Logged illegal move penalties
 * @returns {Array} Processed & sorted leaderboard rows
 */
export function calculateLeaderboard(teams, matches = [], penalties = []) {
  if (!teams || teams.length === 0) return [];

  // Map each team to its aggregated stats
  const statsMap = {};

  teams.forEach(team => {
    statsMap[team.id] = {
      teamId: team.id,
      teamName: team.teamName,
      leaderName: team.leaderName,
      leaderYear: team.leaderYear,
      matchesPlayed: 0,
      rawPoints: 0,
      penaltyDeduction: 0,
      totalPoints: 0,
      totalKills: 0,
      positionBonusTotal: 0,
      wwcdCount: 0, // 1st place finishes
      secondCount: 0,
      thirdCount: 0,
      bestMatchScore: 0,
      matchScores: [],
      penaltiesLogged: [],
      isDisqualified: false,
      isTied: false
    };
  });

  // Aggregate results from completed matches
  matches.forEach(match => {
    if (!match.results || !match.isCompleted) return;

    match.results.forEach(res => {
      const entry = statsMap[res.teamId];
      if (entry) {
        entry.matchesPlayed += 1;
        entry.totalKills += res.kills;
        entry.positionBonusTotal += res.positionBonus;
        entry.rawPoints += res.matchScore;

        if (res.position === 1) entry.wwcdCount += 1;
        if (res.position === 2) entry.secondCount += 1;
        if (res.position === 3) entry.thirdCount += 1;

        if (res.matchScore > entry.bestMatchScore) {
          entry.bestMatchScore = res.matchScore;
        }

        entry.matchScores.push({
          matchId: match.id,
          matchName: match.name,
          position: res.position,
          kills: res.kills,
          score: res.matchScore
        });
      }
    });
  });

  // Apply penalty point deductions & disqualifications
  penalties.forEach(pen => {
    const entry = statsMap[pen.teamId];
    if (entry) {
      if (pen.isDisqualified) {
        entry.isDisqualified = true;
      }
      entry.penaltyDeduction += pen.deductionPoints || 0;
      entry.penaltiesLogged.push(pen);
    }
  });

  // Compute final total points (raw points - penalty deductions)
  Object.values(statsMap).forEach(entry => {
    entry.totalPoints = entry.isDisqualified ? -999 : Math.max(-999, entry.rawPoints - entry.penaltyDeduction);
  });

  const leaderboardList = Object.values(statsMap);

  // Comparator function for exact Tie-Breaker rules
  leaderboardList.sort((a, b) => {
    if (a.isDisqualified !== b.isDisqualified) {
      return a.isDisqualified ? 1 : -1;
    }
    // 1. Total Points
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // 2. Higher Total Kills
    if (b.totalKills !== a.totalKills) {
      return b.totalKills - a.totalKills;
    }
    // 3. Higher Number of 1st-place finishes (WWCD)
    if (b.wwcdCount !== a.wwcdCount) {
      return b.wwcdCount - a.wwcdCount;
    }
    // 4. Higher Best Match Score
    if (b.bestMatchScore !== a.bestMatchScore) {
      return b.bestMatchScore - a.bestMatchScore;
    }
    // Still tied!
    return 0;
  });

  // Assign ranks & flag ties
  for (let i = 0; i < leaderboardList.length; i++) {
    const item = leaderboardList[i];

    if (item.isDisqualified) {
      item.rank = 'DQ';
      continue;
    }

    if (i > 0) {
      const prev = leaderboardList[i - 1];
      if (prev.isDisqualified) {
        item.rank = i + 1;
        continue;
      }

      const isExactlyTied = 
        item.totalPoints === prev.totalPoints &&
        item.totalKills === prev.totalKills &&
        item.wwcdCount === prev.wwcdCount &&
        item.bestMatchScore === prev.bestMatchScore;

      if (isExactlyTied) {
        item.rank = prev.rank;
        item.isTied = true;
        prev.isTied = true;
      } else {
        item.rank = i + 1;
      }
    } else {
      item.rank = 1;
    }
  }

  return leaderboardList;
}
