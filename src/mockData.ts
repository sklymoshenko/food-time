import { FoodOptionType } from './components/Body'
import Chance from 'chance'
import { DateTime } from 'luxon'

const chance = new Chance()

const titles = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Godfather: Part II',
  'The Dark Knight',
  '12 Angry Men',
  "Schindler's List",
  'Pulp Fiction',
  'The Lord of the Rings: The Return of the King',
  'The Good, the Bad and the Ugly',
  'Fight Club',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Star Wars: Episode V - The Empire Strikes Back',
]

export const generateFoodOptions = (): FoodOptionType[] => {
  return titles.map((title) => {
    const todayDay = DateTime.now().day > 2 ? DateTime.now().day : 2
    const date = new Date(
      chance.date({
        string: true,
        year: DateTime.now().year,
        month: DateTime.now().month - 1,
        day: todayDay + chance.integer({ min: 1, max: 30 - todayDay }),
      }),
    ).toISOString()

    const expDate = DateTime.fromISO(date)
    const createdAt = new Date(
      chance.date({
        string: true,
        year: expDate.year,
        month: expDate.month - 1,
        day: todayDay - chance.integer({ min: 1, max: 5 }),
      }),
    ).toISOString()

    return {
      title,
      date,
      createdAt,
    }
  })
}

export const selectedFoodOption: FoodOptionType[] = generateFoodOptions()
