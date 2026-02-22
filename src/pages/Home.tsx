import { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import TimerCard from '../components/TimerCard/TimerCard'
import TaskPanel from '../components/TaskPanel/TaskPanel'
import { useTimer } from '../features/timer/useTimer'
import { useTasks } from '../features/tasks/useTasks'
import { getHealth } from '../lib/api'

function Home() {
  const [apiStatus, setApiStatus] = useState('Checking API...')

  const {
    tasks,
    activeTaskId,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    setActiveTask,
    incrementTaskPomodoro,
  } = useTasks()

  const { state, displayTime, start, pause, completeNow, reset, setMode } = useTimer({
    onComplete: (mode) => {
      if (mode === 'pomodoro' && activeTaskId) {
        incrementTaskPomodoro(activeTaskId)
      }
    },
  })

  useEffect(() => {
    let cancelled = false

    const checkApi = async () => {
      try {
        const health = await getHealth()
        if (!cancelled) {
          setApiStatus(health.ok ? 'API OK' : 'API unavailable')
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Unknown API error'
          setApiStatus(`API error: ${message}`)
        }
      }
    }

    void checkApi()

    return () => {
      cancelled = true
    }
  }, [])

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : undefined
  const activeTaskPomodoroIndex = activeTask
    ? Math.min(activeTask.completedPomodoros + 1, activeTask.estimatedPomodoros)
    : 1
  const theme = state.mode === 'pomodoro' ? 'focus' : 'break'

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="home">
        <Header />
        <p className="home__api-status">{apiStatus}</p>
        <main className="home__main">
          <TimerCard
            mode={state.mode}
            status={state.status}
            displayTime={displayTime}
            activeTaskTitle={activeTask?.title}
            activeTaskPomodoroIndex={activeTaskPomodoroIndex}
            onStart={start}
            onPause={pause}
            onCompleteNow={completeNow}
            onReset={reset}
            onSetMode={setMode}
          />
          <TaskPanel
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectTask={setActiveTask}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </main>
      </div>
    </div>
  )
}

export default Home
