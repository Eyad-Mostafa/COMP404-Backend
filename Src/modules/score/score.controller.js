import { asyncHandler } from "../../utils/errorHandling.js";
import { ScoreService } from "./score.service.js";
import { ResponseFactory } from "../../utils/ResponseFactory.js";
import { AppError } from "../../utils/AppError.js";

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

export const createScore = asyncHandler(async (req, res, next) => {
  const playerId = Number(req.body.playerId);
  const level = Number(req.body.level);
  const gameScore = Number(req.body.score);
  const coins = Number(req.body.coins);
  const minutesPlayed = Number(req.body.minutesPlayed);

  if (
    !isValidNumber(playerId) ||
    !isValidNumber(level) ||
    !isValidNumber(gameScore) ||
    !isValidNumber(coins) ||
    !isValidNumber(minutesPlayed)
  ) {
    throw new AppError("Invalid input: all fields must be valid numbers", 400);
  }

  if (playerId <= 0 || level <= 0) {
    throw new AppError("playerId and level must be positive numbers", 400);
  }

  const newScore = await ScoreService.saveScore(
    playerId,
    level,
    gameScore,
    coins,
    minutesPlayed
  );

  if (newScore === null) {
    return ResponseFactory.success(
      res,
      "Existing score is higher. No update made.",
      null,
      200
    );
  }

  return ResponseFactory.success(
    res,
    "Score Saved Successfully",
    newScore,
    200
  );
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
