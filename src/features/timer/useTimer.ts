import { useEffect, useMemo, useReducer, useRef } from 'react'
import { formatMMSS } from '../../lib/format'
import { initialTimerState, timerReducer } from './timerReducer'
import type { Mode, TimerState } from './timerTypes'

type UseTimerOptions = {
  onComplete?: (mode: Mode) => void
}

export function useTimer(options?: UseTimerOptions) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState)
  const previousRemaining = useRef(state.remainingSeconds)

  useEffect(() => {
    if (state.status !== 'running') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [state.status])

  useEffect(() => {
    const wasRemaining = previousRemaining.current
    if (wasRemaining > 0 && state.remainingSeconds === 0) {
      options?.onComplete?.(state.mode)
    }
    previousRemaining.current = state.remainingSeconds
  }, [state.remainingSeconds, state.mode, options])

  const displayTime = useMemo(
    () => formatMMSS(state.remainingSeconds),
    [state.remainingSeconds],
  )

  return {
    state,
    displayTime,
    start: () => dispatch({ type: 'start' }),
    pause: () => dispatch({ type: 'pause' }),
    completeNow: () => {
      if (state.mode !== 'pomodoro') {
        return
      }
      options?.onComplete?.('pomodoro')
      dispatch({ type: 'completeNow' })
    },
    reset: () => dispatch({ type: 'reset' }),
    setMode: (mode: Mode) => dispatch({ type: 'setMode', mode }),
    setDurations: (durations: Partial<TimerState['durations']>) =>
      dispatch({ type: 'setDurations', durations }),
  }
}
