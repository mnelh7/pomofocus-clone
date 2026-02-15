import type { Task } from './taskTypes'

export const TASKS_STORAGE_KEY = 'pomofocus.tasks.v1'

type BaseTask = {
  id: string
  title: string
  completed: boolean
  createdAt: number
  estimatedPomodoros?: number
  completedPomodoros?: number
  note?: unknown
}

const isBaseTask = (value: unknown): value is BaseTask => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as BaseTask
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'number'
  )
}

const sanitizeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

export const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(TASKS_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(isBaseTask)
      .map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt,
        estimatedPomodoros: sanitizeNumber(task.estimatedPomodoros, 1),
        completedPomodoros: sanitizeNumber(task.completedPomodoros, 0),
        note: typeof task.note === 'string' ? task.note : undefined,
      }))
  } catch {
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}
