import { asyncHandler } from "../../utils/errorHandling.js";
import { ScoreService } from "./score.service.js";
import { ResponseFactory } from "../../utils/ResponseFactory.js";

export const createScore = asyncHandler(async (req, res, next) => {
  const playerId = parseInt(req.body.playerId, 10);
  const level = parseInt(req.body.level, 10);
  const gameScore = parseInt(req.body.score, 10);
  const coins = parseInt(req.body.coins, 10);
  const minutesPlayed = parseFloat(req.body.minutesPlayed);

  const newScore = await ScoreService.saveScore(
    playerId, level, gameScore, coins, minutesPlayed
  );

  if (newScore === null) {
    return ResponseFactory.success(res, "Existing score is higher. No update made.", null, 200);
  }

  return ResponseFactory.success(res, "Score Saved Successfully", newScore, 200);
});

export const getScoreByPlayerId = asyncHandler(async (req, res, next) => {
  const playerId = parseInt(req.params.playerId, 10);

  const scoreData = await ScoreService.getScoreDetailsByPlayerId(playerId);

  return ResponseFactory.success(
    res,
    "Scores Retrieved Successfully",
    scoreData,
    200
  );
});

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const count = parseInt(req.query.count, 10) || 10;

  const leaderboard = await ScoreService.getLeaderboard(count);

  return ResponseFactory.success(
    res,
    "Leaderboard Retrieved Successfully",
    leaderboard,
    200
  );
});
