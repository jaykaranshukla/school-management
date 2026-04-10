import { useState, useEffect } from 'react'
import API from '../api/axios'
import StudentForm from './StudentForm'

function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editStudent, setEditStudent] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students')
      setStudents(res.data)
    } catch (err) {
      console.error('Failed to fetch students', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      await API.delete(`/students/${id}`)
      fetchStudents()
    } catch (err) {
      console.error('Failed to delete student', err)
    }
  }

  const handleEdit = (student) => {
    setEditStudent(student)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setEditStudent(null)
    setShowForm(false)
    fetchStudents()
  }

  return (
    <div>
      {/* Add Student Button */}
      <button
        onClick={() => { setEditStudent(null); setShowForm(true) }}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
      >
        + Add Student
      </button>

      {/* Form - shows when showForm is true */}
      {showForm && (
        <StudentForm
          existingStudent={editStudent}
          onClose={handleFormClose}
        />
      )}

      {/* Student List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-400">No students added yet.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((s) => (
            <li
              key={s._id}
              className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500">Class {s.className} • Roll No. {s.rollNumber}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentList