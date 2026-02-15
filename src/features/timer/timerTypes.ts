export type Mode = 'pomodoro' | 'shortBreak' | 'longBreak'

export type Status = 'idle' | 'running' | 'paused'

export interface TimerState {
  mode: Mode
  status: Status
  remainingSeconds: number
  durations: Record<Mode, number>
}

export type TimerAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'setMode'; mode: Mode }
  | { type: 'tick' }
  | { type: 'setDurations'; durations: Partial<Record<Mode, number>> }
