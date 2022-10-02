import { DateTime } from 'luxon'
import { describe, it, expect } from 'vitest'
import { palette } from '../mockData'
import { dataColor, indicatorWidth } from './indicatorsConfig'
import { dayDiff } from './time'

describe('Data color configs', () => {
  describe('data color', () => {
    it('Should return success when day diff is more than 3 days', () => {
      const expDate = DateTime.now().plus({ day: 4 }).toISO()

      expect(dataColor(expDate, palette)).toEqual(palette.success?.dark)
      expect(dataColor(expDate, palette)).not.toEqual(palette.warning?.dark)
      expect(dataColor(expDate, palette)).not.toEqual(palette.error?.dark)
    })

    it('Should return warning when day diff is between 1 and 3 days', () => {
      const expDate = DateTime.now().plus({ day: 2 }).toISO()
      const expDate2 = DateTime.now().plus({ day: 1 }).toISO()

      expect(dataColor(expDate, palette)).toEqual(palette.warning?.dark)
      expect(dataColor(expDate, palette)).not.toEqual(palette.success?.dark)
      expect(dataColor(expDate, palette)).not.toEqual(palette.error?.dark)

      expect(dataColor(expDate2, palette)).toEqual(palette.warning?.dark)
      expect(dataColor(expDate2, palette)).not.toEqual(palette.success?.dark)
      expect(dataColor(expDate2, palette)).not.toEqual(palette.error?.dark)
    })
  })

  describe('Indicator Width', () => {
    it('Returns "100%" when day diff is less than 0 -> expired', () => {
      const expDate = DateTime.now().toISO()
      const createdAt = DateTime.now().minus({ day: 1 }).toISO()

      expect(indicatorWidth(expDate, createdAt)).toEqual('100%')
    })

    it('Returns "85%" if created today and expiration date is between 1 to 3 days from now', () => {
      const daysRange = [1, 2, 3]
      const wrongDaysRange = [-5, 4, 0]
      const createdAt = DateTime.now().toISO()

      for (const day of daysRange) {
        const isoDate = DateTime.now().plus({ day }).toISO()
        expect(indicatorWidth(isoDate, createdAt)).toEqual('85%')
      }

      for (const day of wrongDaysRange) {
        const isoDate = DateTime.now().plus({ day }).toISO()
        expect(indicatorWidth(isoDate, createdAt)).not.toEqual('85%')
      }
    })

    it('Returns "5%" if created today and expiration date is later than 3 from now', () => {
      const daysRange = [4, 40, 100]
      const wrongDaysRange = [-5, 1, 3]
      const createdAt = DateTime.now().toISO()

      for (const day of daysRange) {
        const isoDate = DateTime.now().plus({ day }).toISO()
        expect(indicatorWidth(isoDate, createdAt)).toEqual('5%')
      }

      for (const day of wrongDaysRange) {
        const isoDate = DateTime.now().plus({ day }).toISO()
        expect(indicatorWidth(isoDate, createdAt)).not.toEqual('5%')
      }
    })

    it('Return correct percentage for days different range', () => {
      const expDays = 9
      let createdAtDays = 1
      let correctPercentage = 100 - Math.round((expDays / (expDays + createdAtDays)) * 100)
      let createdAt = DateTime.now().minus({ day: createdAtDays }).toISO()
      let expDate = DateTime.now().plus({ day: expDays }).toISO()
      expect(indicatorWidth(expDate, createdAt)).toEqual(`${correctPercentage}%`)

      createdAtDays = 19
      createdAt = DateTime.now().minus({ day: createdAtDays }).toISO()
      expDate = DateTime.now().minus({ day: expDays }).toISO()
      correctPercentage = 100

      expect(indicatorWidth(expDate, createdAt)).toEqual(`${correctPercentage}%`)
    })
  })
})
