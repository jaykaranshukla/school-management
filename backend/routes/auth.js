import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const router = express.Router()

// POST /api/auth/register  → create admin (only use once to seed)
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    const existing = await Admin.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' })
    }
    const admin = await Admin.create({ email, password })
    res.status(201).json({ message: 'Admin created successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/auth/login  → login and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await admin.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router