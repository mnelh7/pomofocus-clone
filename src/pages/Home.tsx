import Header from '../components/Header/Header'
import TimerCard from '../components/TimerCard/TimerCard'
import TaskPanel from '../components/TaskPanel/TaskPanel'
import { useTimer } from '../features/timer/useTimer'
import { useTasks } from '../features/tasks/useTasks'

function Home() {
  const {
    tasks,
    activeTaskId,
    addTask,
    toggleTask,
    deleteTask,
    setActiveTask,
    incrementTaskPomodoro,
  } = useTasks()

  const { state, displayTime, start, pause, reset, setMode } = useTimer({
    onComplete: (mode) => {
      if (mode === 'pomodoro' && activeTaskId) {
        incrementTaskPomodoro(activeTaskId)
      }
    },
  })

  return (
    <div className="home">
      <Header />
      <main className="home__main">
        <TimerCard
          mode={state.mode}
          status={state.status}
          displayTime={displayTime}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSetMode={setMode}
        />
        <TaskPanel
          tasks={tasks}
          activeTaskId={activeTaskId}
          onSelectTask={setActiveTask}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  )
}

export default Home
