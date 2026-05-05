import { asyncHandler } from "../../utils/errorHandling.js";
import { ScoreService } from "./score.service.js";
import { ResponseFactory } from "../../utils/ResponseFactory.js";
import { AppError } from "../../utils/AppError.js";

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

export const createScore = asyncHandler(async (req, res, next) => {
  
  // Vercel DEBUG LOG: raw request
  console.log("🔥 SCORE REQUEST RECEIVED");
  console.log("📦 BODY:", JSON.stringify(req.body));
  console.log("🌐 HEADERS:", JSON.stringify(req.headers));

  const playerId = Number(req.body.playerId);
  const level = Number(req.body.level);
  const gameScore = Number(req.body.score);
  const coins = Number(req.body.coins);
  const minutesPlayed = Number(req.body.minutesPlayed);

  // 🔥 Vercel DEBUG LOG: parsed values
  console.log("🔢 PARSED VALUES:", {
    playerId,
    level,
    gameScore,
    coins,
    minutesPlayed,
  });

  // detect NaN early
  const invalidFields = [];

  if (!isValidNumber(playerId)) invalidFields.push("playerId");
  if (!isValidNumber(level)) invalidFields.push("level");
  if (!isValidNumber(gameScore)) invalidFields.push("score");
  if (!isValidNumber(coins)) invalidFields.push("coins");
  if (!isValidNumber(minutesPlayed)) invalidFields.push("minutesPlayed");

  if (invalidFields.length > 0) {
    console.log("❌ INVALID FIELDS:", invalidFields);
    console.log("📦 RAW BODY THAT CAUSED ERROR:", req.body);

    throw new AppError(
      `Invalid input: ${invalidFields.join(", ")} must be valid numbers`,
      400
    );
  }

  if (playerId <= 0 || level <= 0) {
    console.log("❌ INVALID RANGE:", { playerId, level });

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
    console.log("ℹ️ SCORE NOT UPDATED (existing higher)");

    return ResponseFactory.success(
      res,
      "Existing score is higher. No update made.",
      null,
      200
    );
  }

  console.log("✅ SCORE SAVED SUCCESSFULLY:", newScore);

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
