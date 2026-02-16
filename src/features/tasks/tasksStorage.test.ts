import { beforeEach, describe, expect, it } from 'vitest'
import { TASKS_STORAGE_KEY, loadTasks } from './tasksStorage'

describe('loadTasks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('migrates old-format tasks with default pomodoro fields', () => {
    const legacyTasks = [
      {
        id: 't1',
        title: 'Write tests',
        completed: false,
        createdAt: 1700000000000,
      },
    ]

    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(legacyTasks))

    const result = loadTasks()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 't1',
      title: 'Write tests',
      completed: false,
      createdAt: 1700000000000,
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      note: undefined,
    })
  })

  it('filters invalid entries and keeps valid migrated tasks', () => {
    const mixed = [
      {
        id: 'valid',
        title: 'Valid task',
        completed: true,
        createdAt: 1700000000100,
      },
      { id: 'missing-fields' },
      42,
      null,
      {
        id: 'bad-created-at',
        title: 'Bad',
        completed: false,
        createdAt: 'not-a-number',
      },
    ]

    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(mixed))

    const result = loadTasks()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('valid')
    expect(result[0].estimatedPomodoros).toBe(1)
    expect(result[0].completedPomodoros).toBe(0)
  })

  it('returns [] when storage JSON is invalid', () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, '{invalid-json')
    expect(loadTasks()).toEqual([])
  })
})
