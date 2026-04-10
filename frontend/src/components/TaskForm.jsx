import { useState, useEffect } from 'react'
import API from '../api/axios'

function TaskForm({ existingTask, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [studentId, setStudentId] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch all students for the dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get('/students')
        setStudents(res.data)
      } catch (err) {
        console.error('Failed to fetch students', err)
      }
    }
    fetchStudents()
  }, [])

  // If editing, prefill the form
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title)
      setDescription(existingTask.description || '')
      setStudentId(existingTask.student?._id || '')
    }
  }, [existingTask])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const data = { title, description, student: studentId }

    try {
      if (existingTask) {
        // Edit mode
        await API.put(`/tasks/${existingTask._id}`, data)
      } else {
        // Add mode
        await API.post('/tasks', data)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">

      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {existingTask ? '✏️ Edit Task' : '➕ Assign New Task'}
      </h3>

      {error && (
        <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg mb-3 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Math Homework Chapter 5"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Solve exercises 1 to 10"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Assign to Student
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — Class {s.className}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingTask ? 'Update Task' : 'Assign Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

export default TaskForm