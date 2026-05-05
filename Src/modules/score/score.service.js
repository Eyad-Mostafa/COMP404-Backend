import { ScoreRepository } from "./score.repository.js";
import { AppError } from "../../utils/AppError.js";

export const ScoreService = {
  saveScore: async (playerId, level, gameScore, coins, minutesPlayed) => {

    const calculatedScore = Math.max(
      0,
      Math.floor((2 * coins) - (10 * minutesPlayed))
    );

    if (gameScore !== calculatedScore) {
      throw new AppError(
        `Invalid Score: Expected ${calculatedScore}, but got ${gameScore}`,
        400
      );
    }

    const existingScoreRecord = await ScoreRepository.getLevelScore(playerId, level);

    if (existingScoreRecord && calculatedScore < existingScoreRecord.score) {
      return null;
    }

    return await ScoreRepository.upsertLevelScore(playerId, level, {
      score: calculatedScore,
      coins,
      minutesPlayed,
    });
  },

  getScoreDetailsByPlayerId: async (playerId) => {
    const levelScores = await ScoreRepository.getScoreByPlayerId(playerId);

    const totalScore = levelScores.reduce((sum, level) => sum + level.score, 0);

    return {
      totalScore,
      levels: levelScores,
    };
  },

  getLeaderboard: async (count) => {
    const usersWithScores = await ScoreRepository.getLeaderboard();

    const leaderboard = usersWithScores
      .map((user) => {
        const totalScore = user.scores.reduce((sum, s) => sum + s.score, 0);
        return {
        name: user.name,
          score: totalScore,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count);

    return leaderboard;
  },
};