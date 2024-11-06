export function floor(num: number) {
  return Math.floor(num)
}

function formatTwoPad(num: number) {
  num = Math.floor(num)
  return String(num).padStart(2, '0')
}

export function formatTime(time: number) {
  if (time < 60) return `00:${formatTwoPad(time)}`
  if (time < 3600) {
    return formatTwoPad(time / 60) + ':' + formatTwoPad(time % 60)
  }
  const h = Math.floor(time / 3600)
  const m = Math.floor((time - h * 3600) / 60)
  const s = Math.floor(time % 60)
  return formatTwoPad(h) + ':' + formatTwoPad(m) + ':' + formatTwoPad(s)
}

// formatTimestamp 用于格式化时间戳
export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${formatTwoPad(month)}-${formatTwoPad(day)} ${formatTwoPad(hour)}:${formatTwoPad(minute)}`
}