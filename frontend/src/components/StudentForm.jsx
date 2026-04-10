import { useState, useEffect } from 'react'
import API from '../api/axios'

function StudentForm({ existingStudent, onClose }) {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If editing, prefill the form with existing data
  useEffect(() => {
    if (existingStudent) {
      setName(existingStudent.name)
      setClassName(existingStudent.className)
      setRollNumber(existingStudent.rollNumber)
    }
  }, [existingStudent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const data = { name, className, rollNumber }

    try {
      if (existingStudent) {
        // Edit mode
        await API.put(`/students/${existingStudent._id}`, data)
      } else {
        // Add mode
        await API.post('/students', data)
      }
      onClose() // close form and refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">

      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {existingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
      </h3>

      {error && (
        <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg mb-3 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Student Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Class
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. 10"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Roll Number
          </label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g. 21"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingStudent ? 'Update' : 'Add Student'}
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

export default StudentForm