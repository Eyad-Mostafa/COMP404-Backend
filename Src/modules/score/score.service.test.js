import test from 'node:test';
import assert from 'node:assert';
import { ScoreService } from './score.service.js';
import { ScoreRepository } from './score.repository.js';

test('ScoreService - saveScore success (new record)', async (t) => {
  const originalGet = ScoreRepository.getLevelScore;
  const originalUpsert = ScoreRepository.upsertLevelScore;

  t.after(() => {
    ScoreRepository.getLevelScore = originalGet;
    ScoreRepository.upsertLevelScore = originalUpsert;
  });

  ScoreRepository.getLevelScore = async () => null;

  ScoreRepository.upsertLevelScore = async (playerId, level, data) => ({
    playerId,
    level,
    ...data,
  });

  // score = (2 * coins) - (10 * minutesPlayed)
  const result = await ScoreService.saveScore(1, 1, 10, 10, 1);

  assert.strictEqual(result.score, 10);
});

test('ScoreService - saveScore fails (invalid calculation)', async () => {
  await assert.rejects(
    () => ScoreService.saveScore(1, 1, 999, 10, 1),
    {
      message: 'Invalid Score: Expected 10, but game sent 999',
    }
  );
});

test('ScoreService - saveScore ignores lower score', async (t) => {
  const originalGet = ScoreRepository.getLevelScore;

  t.after(() => {
    ScoreRepository.getLevelScore = originalGet;
  });

  ScoreRepository.getLevelScore = async () => ({
    score: 50,
  });

  const result = await ScoreService.saveScore(1, 1, 10, 10, 1);

  assert.strictEqual(result, null);
});

test('ScoreService - getScoreDetailsByPlayerId', async (t) => {
  const original = ScoreRepository.getScoreByPlayerId;

  t.after(() => {
    ScoreRepository.getScoreByPlayerId = original;
  });

  ScoreRepository.getScoreByPlayerId = async () => [
    { level: 1, score: 10 },
    { level: 2, score: 20 },
  ];

  const result = await ScoreService.getScoreDetailsByPlayerId(1);

  assert.strictEqual(result.totalScore, 30);
  assert.strictEqual(result.levels.length, 2);
});

test('ScoreService - getLeaderboard sorting and limit', async (t) => {
  const original = ScoreRepository.getLeaderboard;

  t.after(() => {
    ScoreRepository.getLeaderboard = original;
  });

  ScoreRepository.getLeaderboard = async () => [
    { name: 'Player A', scores: [{ score: 10 }, { score: 20 }] },
    { name: 'Player B', scores: [{ score: 50 }] },
    { name: 'Player C', scores: [{ score: 5 }] },
  ];

  const result = await ScoreService.getLeaderboard(2);

  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].name, 'Player B');
  assert.strictEqual(result[0].score, 50);
  assert.strictEqual(result[1].name, 'Player A');
  assert.strictEqual(result[1].score, 30);
});