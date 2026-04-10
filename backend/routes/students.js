import express from 'express'
import Student from '../models/Student.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/students → get all students
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 })
    res.status(200).json(students)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/students → add new student
router.post('/', protect, async (req, res) => {
  const { name, className, rollNumber } = req.body
  try {
    const student = await Student.create({ name, className, rollNumber })
    res.status(201).json(student)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PUT /api/students/:id → edit student
router.put('/:id', protect, async (req, res) => {
  const { name, className, rollNumber } = req.body
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, className, rollNumber },
      { new: true }
    )
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.status(200).json(student)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE /api/students/:id → delete student
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.status(200).json({ message: 'Student deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router