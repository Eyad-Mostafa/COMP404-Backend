import { Router } from "express";
import * as scoreController from "./score.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Score
 *     description: Score management
 */

/**
 * @swagger
 * /score/add:
 *   post:
 *     summary: Create or update a score for a specific level
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: integer
 *               level:
 *                 type: integer
 *               score:
 *                 type: integer
 *               coins:
 *                 type: integer
 *               minutesPlayed:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Score Saved Successfully
 */
router.post("/add", scoreController.createScore);

/**
 * @swagger
 * /score/player/{playerId}:
 *   get:
 *     summary: Get cumulative score and level breakdown by player ID
 *     tags: [Score]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Scores Retrieved Successfully
 */
router.get("/player/:playerId", scoreController.getScoreByPlayerId);

export default router;