import prisma from "../../config/prisma.js";

export const ScoreRepository = {
  upsertLevelScore: async (playerId, level, scoreData) => {
    return await prisma.score.upsert({
      where: {
        playerId_level: {
          playerId: playerId,
          level: level,
        },
      },
      update: scoreData,
      create: {
        playerId,
        level,
        ...scoreData,
      },
    });
  },

  getScoreByPlayerId: async (playerId) => {
    return await prisma.score.findMany({
      where: { playerId },
      orderBy: { level: 'asc' }
    });
  },
  
  getLevelScore: async (playerId, level) => {
    return await prisma.score.findUnique({
      where: {
        playerId_level: {
          playerId: playerId,
          level: level,
        },
      },
    });
  },

  getLeaderboard: async () => {
    return await prisma.user.findMany({
      select: {
        name: true,
        scores: {
          select: {
            score: true,
          },
        },
      },
    });
  },
};