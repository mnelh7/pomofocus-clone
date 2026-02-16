import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task } from './taskTypes'
import { loadTasks, saveTasks } from './tasksStorage'

const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `task-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

const sortByCreatedAt = (items: Task[]): Task[] =>
  [...items].sort((a, b) => b.createdAt - a.createdAt)

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => sortByCreatedAt(loadTasks()))
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((title: string, note?: string) => {
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }

    const normalizedNote = note?.trim()

    const newTask: Task = {
      id: createId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      note: normalizedNote ? normalizedNote : undefined,
    }

    setTasks((prev) => sortByCreatedAt([newTask, ...prev]))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      sortByCreatedAt(
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      ),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }, [])

  const setActiveTask = useCallback((id: string) => {
    setActiveTaskId(id)
  }, [])

  const incrementTaskPomodoro = useCallback((id: string) => {
    setTasks((prev) =>
      sortByCreatedAt(
        prev.map((task) => {
          if (task.id !== id) {
            return task
          }

          const nextCompleted = Math.min(
            task.completedPomodoros + 1,
            task.estimatedPomodoros,
          )

          return { ...task, completedPomodoros: nextCompleted }
        }),
      ),
    )
  }, [])

  return useMemo(
    () => ({
      tasks,
      activeTaskId,
      addTask,
      toggleTask,
      deleteTask,
      clearCompleted,
      setActiveTask,
      incrementTaskPomodoro,
    }),
    [
      tasks,
      activeTaskId,
      addTask,
      toggleTask,
      deleteTask,
      clearCompleted,
      setActiveTask,
      incrementTaskPomodoro,
    ],
  )
}
