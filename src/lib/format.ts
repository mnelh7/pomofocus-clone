export function formatMMSS(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  const paddedSeconds = String(remainingSeconds).padStart(2, '0')
  const paddedMinutes = String(minutes).padStart(2, '0')
  return `${paddedMinutes}:${paddedSeconds}`
}
