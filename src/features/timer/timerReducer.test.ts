import { describe, expect, it } from 'vitest'
import { initialTimerState, timerReducer } from './timerReducer'
import type { TimerState } from './timerTypes'

const createState = (overrides: Partial<TimerState> = {}): TimerState => ({
  ...initialTimerState,
  durations: { ...initialTimerState.durations },
  ...overrides,
})

describe('timerReducer', () => {
  it('start sets status running', () => {
    const state = createState({ status: 'idle' })
    const next = timerReducer(state, { type: 'start' })
    expect(next.status).toBe('running')
  })

  it('pause sets paused', () => {
    const state = createState({ status: 'running' })
    const next = timerReducer(state, { type: 'pause' })
    expect(next.status).toBe('paused')
  })

  it('reset sets remainingSeconds to mode duration and status idle', () => {
    const state = createState({
      mode: 'shortBreak',
      status: 'running',
      remainingSeconds: 7,
    })
    const next = timerReducer(state, { type: 'reset' })
    expect(next.status).toBe('idle')
    expect(next.remainingSeconds).toBe(state.durations.shortBreak)
  })

  it('setMode switches mode, resets remainingSeconds, status idle', () => {
    const state = createState({
      mode: 'pomodoro',
      status: 'running',
      remainingSeconds: 42,
    })
    const next = timerReducer(state, { type: 'setMode', mode: 'longBreak' })
    expect(next.mode).toBe('longBreak')
    expect(next.status).toBe('idle')
    expect(next.remainingSeconds).toBe(state.durations.longBreak)
  })

  it('tick decrements by 1 when above zero', () => {
    const state = createState({ status: 'running', remainingSeconds: 10 })
    const next = timerReducer(state, { type: 'tick' })
    expect(next.remainingSeconds).toBe(9)
  })

  it('tick never goes below 0 and sets idle at 0', () => {
    const atOne = createState({ status: 'running', remainingSeconds: 1 })
    const atZero = timerReducer(atOne, { type: 'tick' })
    expect(atZero.remainingSeconds).toBe(0)
    expect(atZero.status).toBe('idle')

    const alreadyZero = createState({ status: 'running', remainingSeconds: 0 })
    const stillZero = timerReducer(alreadyZero, { type: 'tick' })
    expect(stillZero.remainingSeconds).toBe(0)
    expect(stillZero.status).toBe('idle')
  })

  it('completeNow switches to shortBreak idle with shortBreak duration', () => {
    const state = createState({
      mode: 'pomodoro',
      status: 'running',
      remainingSeconds: 999,
    })
    const next = timerReducer(state, { type: 'completeNow' })
    expect(next.mode).toBe('shortBreak')
    expect(next.status).toBe('idle')
    expect(next.remainingSeconds).toBe(state.durations.shortBreak)
  })

  it('completeNow uses current shortBreak duration from state', () => {
    const state = createState({
      durations: {
        pomodoro: 1500,
        shortBreak: 123,
        longBreak: 900,
      },
    })
    const next = timerReducer(state, { type: 'completeNow' })
    expect(next.remainingSeconds).toBe(123)
  })
})
