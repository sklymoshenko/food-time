import { DateTime } from 'luxon'

export const mainTimeFormat = (date: Date | string): string => {
  let formatedDate
  if (typeof date === 'string') {
    formatedDate = DateTime.fromISO(date)
  } else {
    formatedDate = DateTime.fromJSDate(date)
  }

  return formatedDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
}

export const dayDiff = (firstDate: string, secondDate: string): number => {
  const expirationDay = DateTime.fromISO(firstDate).set({ second: 0, minute: 0, hour: 0 })
  const currentDay = DateTime.fromISO(secondDate).set({ second: 0, minute: 0, hour: 0 })
  const diff = expirationDay.diff(currentDay, 'days').toObject().days || 0

  return Math.round(diff)
}
