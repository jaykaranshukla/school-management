import { useState, useEffect } from 'react'
import API from '../api/axios'
import TaskForm from './TaskForm'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTask, setEditTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await API.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
      })
      fetchTasks()
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setEditTask(null)
    setShowForm(false)
    fetchTasks()
  }

  return (
    <div>
      {/* Add Task Button */}
      <button
        onClick={() => { setEditTask(null); setShowForm(true) }}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
      >
        + Assign Task
      </button>

      {/* Form - shows when showForm is true */}
      {showForm && (
        <TaskForm
          existingTask={editTask}
          onClose={handleFormClose}
        />
      )}

      {/* Task List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-400">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t._id}
              className={`border rounded-xl px-4 py-3 ${
                t.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    👨‍🎓 {t.student?.name || 'Unknown'} • Class {t.student?.className}
                  </p>
                  {t.description && (
                    <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {t.completed ? 'Done' : 'Pending'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleToggleComplete(t)}
                  className={`text-xs px-3 py-1 rounded-lg transition ${
                    t.completed
                      ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  {t.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => handleEdit(t)}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
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

export default TaskList