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
