export const getDayOfWeekFromString = (timestamp: string): string => {
  const date = new Date(timestamp)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayIndex = date.getDay()

  return daysOfWeek[dayIndex]
}
