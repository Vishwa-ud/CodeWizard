// controllers/ProblemController.js
const Problem = require('../models/Problem');

// Add a new problem
exports.addProblem = async (req, res) => {
  const { title, description, email } = req.body;

  try {
    const newProblem = new Problem({
      title,
      description,
      email,
    });

    await newProblem.save();
    res.status(201).json({ msg: 'Problem added successfully', problem: newProblem });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get problems by email
exports.getProblemsByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const problems = await Problem.find({ email });
    if (problems.length === 0) return res.status(404).json({ msg: 'No problems found for this email' });

    res.json(problems);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update problem by MongoDB ID
exports.updateProblemById = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedProblem) return res.status(404).json({ msg: 'Problem not found' });

    res.json({ msg: 'Problem updated successfully', problem: updatedProblem });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete problem by MongoDB ID
exports.deleteProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).json({ msg: 'Problem not found' });

    res.json({ msg: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
