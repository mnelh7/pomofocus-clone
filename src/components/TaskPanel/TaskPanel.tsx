import { useState } from 'react'
import type { Task } from '../../features/tasks/taskTypes'
import './TaskPanel.css'

type TaskPanelProps = {
  tasks: Task[]
  activeTaskId: string | null
  onSelectTask: (id: string) => void
  onAddTask: (title: string) => void
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

function TaskPanel({
  tasks,
  activeTaskId,
  onSelectTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskPanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }

    onAddTask(trimmed)
    setTitle('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
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
                    <span
                      className={`task-panel__item-title ${
                        task.completed ? 'task-panel__item-title--done' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>
                  <span className="task-panel__progress">
                    {task.completedPomodoros}/{task.estimatedPomodoros}
                  </span>
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

      {isAdding ? (
        <div className="task-panel__form">
          <input
            className="task-panel__input"
            type="text"
            placeholder="What are you working on?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
        <button className="task-panel__add" type="button" onClick={() => setIsAdding(true)}>
          <span className="task-panel__add-icon" aria-hidden="true">＋</span>
          Add Task
        </button>
      )}
    </section>
  )
}

export default TaskPanel
