// routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const ProblemController = require('../controllers/ProblemController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a new problem
router.post('/problems', authMiddleware, ProblemController.addProblem);

// Get all problems
router.get('/problems', ProblemController.getAllProblems);

// Get problems by email
router.get('/problems/email/:email', authMiddleware, ProblemController.getProblemsByEmail);

// Update problem by MongoDB ID
router.put('/problems/:id', authMiddleware, ProblemController.updateProblemById);

// Delete problem by MongoDB ID
router.delete('/problems/:id', authMiddleware, ProblemController.deleteProblemById);

module.exports = router;
