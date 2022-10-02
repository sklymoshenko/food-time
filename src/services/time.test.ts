import { DateTime } from 'luxon'
import { describe, it, expect } from 'vitest'
import { dayDiff, mainTimeFormat } from './time'

describe('Time', () => {
  describe('Main time format', () => {
    it('Works with string and date inputs', () => {
      const date = DateTime.local(2022, 1, 1)
      const dateJS = DateTime.local(2022, 1, 1).toJSDate()
      const dateISO = dateJS.toISOString()
      const result = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

      expect(mainTimeFormat(dateJS)).toEqual(result)
      expect(mainTimeFormat(dateISO)).toEqual(result)
    })
  })
  describe(' Day diff', () => {
    it('Calculate days diff regardless minutes and seconds', () => {
      const resultDaysDiff = 40
      const now = DateTime.now()
      const firstDate = now.plus({ day: resultDaysDiff }).toJSDate().toISOString()
      const secondDate = now.toJSDate().toISOString()

      expect(dayDiff(firstDate, secondDate)).toEqual(resultDaysDiff)
    })
  })
})
