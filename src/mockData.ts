import { FoodOptionType } from './components/Body'
import Chance from 'chance'
import { DateTime } from 'luxon'

const chance = new Chance()

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
export const foodOptions: readonly FoodOptionType[] = [
  {
    title: 'The Shawshank Redemption',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Godfather',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Godfather: Part II',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Dark Knight',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: '12 Angry Men',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: "Schindler's List",
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'Pulp Fiction',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Good, the Bad and the Ugly',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'Fight Club',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    date: new Date(
      chance.date({ string: true, year: DateTime.now().year, month: DateTime.now().month - 1 }),
    ).toISOString(),
  },
]

export const selectedFoodOption: FoodOptionType[] = foodOptions.slice(0, 10)
