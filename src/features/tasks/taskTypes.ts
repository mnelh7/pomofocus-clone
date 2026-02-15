export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
  estimatedPomodoros: number
  completedPomodoros: number
  note?: string
}
