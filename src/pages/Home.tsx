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
    updateTask,
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
        <main className="home__main">
          <TimerCard
            mode={state.mode}
            status={state.status}
            displayTime={displayTime}
            activeTaskTitle={activeTask?.title}
            activeTaskPomodoroIndex={activeTaskPomodoroIndex}
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
