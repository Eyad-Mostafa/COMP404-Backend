import test from 'node:test';
import assert from 'node:assert';
import { ScoreService } from './score.service.js';
import { ScoreRepository } from './score.repository.js';

test('ScoreService - getLeaderboard sorting and limit', async (t) => {
  const original = ScoreRepository.getLeaderboard;
  
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

  ScoreRepository.getLeaderboard = original;
});

