import { Autocomplete, FilterOptionsState, TextField } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'

export type FoodOptionType = {
  inputValue?: string
  title: string
  date?: Date
}

const filter = createFilterOptions<FoodOptionType>()

type FoodSelectProps = {
  onFoodSelect: (food: FoodOptionType | null) => void
  food: FoodOptionType | null
}

export const FoodSelect = ({ onFoodSelect, food }: FoodSelectProps) => {
  const onSearchChange = (newValue: FoodOptionType | string | null) => {
    if (typeof newValue === 'string') {
      onFoodSelect({
        title: newValue,
      })
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      onFoodSelect({
        title: newValue.inputValue,
      })
    } else {
      onFoodSelect(newValue)
    }
  }

  const filterOptions = (options: FoodOptionType[], params: FilterOptionsState<FoodOptionType>) => {
    const filtered = filter(options, params)

    const { inputValue } = params
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        title: `Add "${inputValue}"`,
      })
    }

    return filtered
  }

  const getOptionLabel = (option: FoodOptionType | string) => {
    if (typeof option === 'string') {
      return option
    }

    if (option.inputValue) {
      return option.inputValue
    }

    return option.title
  }

  return (
    <Autocomplete
      value={food}
      onChange={(event, newValue) => onSearchChange(newValue)}
      filterOptions={filterOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id='free-solo-with-text-demo'
      options={top100Films}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: { xs: '100%', md: '60%' } }}
      freeSolo
      renderInput={(params) => <TextField {...params} label='Free solo with text demo' />}
    />
  )
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films: readonly FoodOptionType[] = [
  { title: 'The Shawshank Redemption', date: new Date() },
  { title: 'The Godfather', date: new Date() },
  { title: 'The Godfather: Part II', date: new Date() },
  { title: 'The Dark Knight', date: new Date() },
  { title: '12 Angry Men', date: new Date() },
  { title: "Schindler's List", date: new Date() },
  { title: 'Pulp Fiction', date: new Date() },
  {
    title: 'The Lord of the Rings: The Return of the King',
    date: new Date(),
  },
  { title: 'The Good, the Bad and the Ugly', date: new Date() },
  { title: 'Fight Club', date: new Date() },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    date: new Date(),
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    date: new Date(),
  },
]
