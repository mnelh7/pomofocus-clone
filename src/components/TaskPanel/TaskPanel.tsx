import { useState } from 'react'
import type { Task } from '../../features/tasks/taskTypes'
import './TaskPanel.css'

type TaskPanelProps = {
  tasks: Task[]
  activeTaskId: string | null
  onSelectTask: (id: string) => void
  onAddTask: (title: string, note?: string, estimatedPomodoros?: number) => void
  onUpdateTask: (
    id: string,
    patch: Partial<Pick<Task, 'title' | 'note' | 'estimatedPomodoros'>>,
  ) => void
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

function TaskPanel({
  tasks,
  activeTaskId,
  onSelectTask,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
}: TaskPanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)

  const isEditing = editingTaskId !== null
  const isFormVisible = isAdding || isEditing

  const normalizeEstimated = (value: number) => Math.max(1, Math.floor(value))

  const resetForm = () => {
    setTitle('')
    setNote('')
    setEstimatedPomodoros(1)
    setIsAdding(false)
    setEditingTaskId(null)
  }

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }

    const nextEstimated = normalizeEstimated(estimatedPomodoros)

    if (editingTaskId) {
      onUpdateTask(editingTaskId, {
        title: trimmed,
        note,
        estimatedPomodoros: nextEstimated,
      })
    } else {
      onAddTask(trimmed, note, nextEstimated)
    }

    resetForm()
  }

  const handleCancel = () => {
    resetForm()
  }

  const handleEnterAddMode = () => {
    setIsAdding(true)
    setEditingTaskId(null)
    setTitle('')
    setNote('')
    setEstimatedPomodoros(1)
  }

  const handleEnterEditMode = (task: Task) => {
    setIsAdding(false)
    setEditingTaskId(task.id)
    setTitle(task.title)
    setNote(task.note ?? '')
    setEstimatedPomodoros(normalizeEstimated(task.estimatedPomodoros))
  }

  const handleEstimatedInputChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) {
      setEstimatedPomodoros(1)
      return
    }

    setEstimatedPomodoros(normalizeEstimated(parsed))
  }

  return (
    <section className="task-panel">
      <div className="task-panel__header">
        <h2 className="task-panel__title">Tasks</h2>
        <button className="task-panel__menu" type="button" aria-label="Task menu">
          ⋮
        </button>
      </div>

      {tasks.length > 0 && (
        <ul className="task-panel__list">
          {tasks.map((task) => {
            const isActive = task.id === activeTaskId

            return (
              <li
                key={task.id}
                className={`task-panel__item ${isActive ? 'task-panel__item--active' : ''}`}
              >
                <button
                  className="task-panel__row"
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                >
                  <label
                    className="task-panel__item-left"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      className="task-panel__checkbox"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                    />
                    <span className="task-panel__item-text">
                      <span
                        className={`task-panel__item-title ${
                          task.completed ? 'task-panel__item-title--done' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.note?.trim() && (
                        <span className="task-panel__item-note">{task.note.trim()}</span>
                      )}
                    </span>
                  </label>
                  <span className="task-panel__progress">
                    {task.completedPomodoros}/{task.estimatedPomodoros}
                  </span>
                </button>
                <button
                  className="task-panel__edit"
                  type="button"
                  onClick={() => handleEnterEditMode(task)}
                >
                  Edit
                </button>
                <button
                  className="task-panel__delete"
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {isFormVisible ? (
        <div className="task-panel__form">
          <input
            className="task-panel__input"
            type="text"
            placeholder={isEditing ? 'Update task title' : 'What are you working on?'}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="task-panel__stepper-row">
            <span className="task-panel__stepper-label">Est Pomodoros</span>
            <div className="task-panel__stepper-controls">
              <button
                className="task-panel__stepper-button"
                type="button"
                onClick={() => setEstimatedPomodoros((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease estimated pomodoros"
              >
                -
              </button>
              <input
                className="task-panel__stepper-input"
                type="number"
                min={1}
                value={estimatedPomodoros}
                onChange={(event) => handleEstimatedInputChange(event.target.value)}
              />
              <button
                className="task-panel__stepper-button"
                type="button"
                onClick={() => setEstimatedPomodoros((prev) => prev + 1)}
                aria-label="Increase estimated pomodoros"
              >
                +
              </button>
            </div>
          </div>

          <label className="task-panel__note-label" htmlFor="task-note">
            Note (optional)
          </label>
          <textarea
            id="task-note"
            className="task-panel__textarea"
            placeholder="Add context for this task"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
          />
          <div className="task-panel__form-actions">
            <button className="task-panel__save" type="button" onClick={handleSave}>
              Save
            </button>
            <button className="task-panel__cancel" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="task-panel__add" type="button" onClick={handleEnterAddMode}>
          <span className="task-panel__add-icon" aria-hidden="true">
            +
          </span>
          Add Task
        </button>
      )}
    </section>
  )
}

export default TaskPanel
