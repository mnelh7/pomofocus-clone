import type { Mode, Status } from '../../features/timer/timerTypes'
import './TimerCard.css'

type TimerCardProps = {
  mode: Mode
  status: Status
  displayTime: string
  activeTaskTitle?: string
  activeTaskPomodoroIndex?: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSetMode: (mode: Mode) => void
}

function TimerCard({
  mode,
  status,
  displayTime,
  activeTaskTitle,
  activeTaskPomodoroIndex,
  onStart,
  onPause,
  onReset,
  onSetMode,
}: TimerCardProps) {
  const isRunning = status === 'running'
  const roundLabel = `#${activeTaskPomodoroIndex ?? 1}`
  const subtitle = activeTaskTitle?.trim() || 'Time to focus!'

  return (
    <section className="timer-card">
      <div className="timer-card__tabs">
        <button
          className={`timer-card__tab ${mode === 'pomodoro' ? 'timer-card__tab--active' : ''}`}
          type="button"
          onClick={() => onSetMode('pomodoro')}
        >
          Pomodoro
        </button>
        <button
          className={`timer-card__tab ${mode === 'shortBreak' ? 'timer-card__tab--active' : ''}`}
          type="button"
          onClick={() => onSetMode('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={`timer-card__tab ${mode === 'longBreak' ? 'timer-card__tab--active' : ''}`}
          type="button"
          onClick={() => onSetMode('longBreak')}
        >
          Long Break
        </button>
      </div>
      <div className="timer-card__time">{displayTime}</div>
      <button
        className="timer-card__start"
        type="button"
        onClick={isRunning ? onPause : onStart}
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>
      <button className="timer-card__reset" type="button" onClick={onReset}>
        Reset
      </button>
      <div className="timer-card__meta">
        <span className="timer-card__round">{roundLabel}</span>
        <span className="timer-card__message">{subtitle}</span>
      </div>
    </section>
  )
}

export default TimerCard
