export const formatToTime = (timestamp: string) => {
  const datetimeObj = new Date(timestamp)
  const timeStr = datetimeObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return timeStr
}
