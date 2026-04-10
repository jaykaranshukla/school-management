import express from 'express'
import Task from '../models/Task.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/tasks → get all tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('student', 'name className')
      .sort({ createdAt: -1 })
    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/tasks → assign new task
router.post('/', protect, async (req, res) => {
  const { title, description, student } = req.body
  try {
    const task = await Task.create({ title, description, student })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PUT /api/tasks/:id → edit or mark complete
router.put('/:id', protect, async (req, res) => {
  const { title, description, student, completed } = req.body
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, student, completed },
      { new: true }
    ).populate('student', 'name className')
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE /api/tasks/:id → delete task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.status(200).json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router