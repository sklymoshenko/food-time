import { Autocomplete, FilterOptionsState, TextField } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { foodOptions } from '../mockData'
import { FoodOptionType } from './Body'

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
      options={foodOptions}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: { xs: '100%', md: '60%' } }}
      freeSolo
      renderInput={(params) => <TextField {...params} label='Grocery name' />}
    />
  )
}
