import { ScoreRepository } from "./score.repository.js";

export const ScoreService = {
  saveScore: async (playerId, level, gameScore, coins, minutesPlayed) => {

    let calculatedScore = Math.floor((2 * coins) - (10 * minutesPlayed));

    calculatedScore = Math.max(0, calculatedScore);

    if (gameScore !== calculatedScore) {
      throw new Error(`Invalid Score: Expected ${calculatedScore}, but game sent ${gameScore}`);
    }

    const existingScoreRecord = await ScoreRepository.getLevelScore(playerId, level);

    if (calculatedScore < existingScoreRecord.score) {
      return null;
    }

    const savedScore = await ScoreRepository.upsertLevelScore(playerId, level, {
      score: calculatedScore,
      coins,
      minutesPlayed
    });

    return savedScore;
  },

  getScoreDetailsByPlayerId: async (playerId) => {
    const levelScores = await ScoreRepository.getScoreByPlayerId(playerId);

    const totalScore = levelScores.reduce((sum, level) => sum + level.score, 0);

    return {
      totalScore,
      levels: levelScores
    };
  }
};