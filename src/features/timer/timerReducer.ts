import type { Mode, TimerAction, TimerState } from './timerTypes'

const defaultDurations: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const clampToZero = (value: number) => Math.max(0, value)

export const initialTimerState: TimerState = {
  mode: 'pomodoro',
  status: 'idle',
  remainingSeconds: defaultDurations.pomodoro,
  durations: defaultDurations,
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start':
      return state.status === 'running' ? state : { ...state, status: 'running' }
    case 'pause':
      return state.status === 'running' ? { ...state, status: 'paused' } : state
    case 'reset':
      return {
        ...state,
        status: 'idle',
        remainingSeconds: state.durations[state.mode],
      }
    case 'setMode': {
      const nextMode = action.mode
      return {
        ...state,
        mode: nextMode,
        status: 'idle',
        remainingSeconds: state.durations[nextMode],
      }
    }
    case 'tick': {
      const nextRemaining = clampToZero(state.remainingSeconds - 1)
      if (nextRemaining === 0) {
        return { ...state, remainingSeconds: 0, status: 'idle' }
      }
      return { ...state, remainingSeconds: nextRemaining }
    }
    case 'completeNow':
      return {
        ...state,
        mode: 'shortBreak',
        status: 'idle',
        remainingSeconds: state.durations.shortBreak,
      }
    case 'setDurations': {
      const nextDurations = { ...state.durations, ...action.durations }
      return {
        ...state,
        durations: nextDurations,
        remainingSeconds: nextDurations[state.mode],
        status: 'idle',
      }
    }
    default:
      return state
  }
}
