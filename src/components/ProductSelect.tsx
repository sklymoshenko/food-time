import { Autocomplete, FilterOptionsState, TextField } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { ProductOptionType } from './Body'

const filter = createFilterOptions<ProductOptionType>()

type ProductSelectProps = {
  onProductSelect: (product: ProductOptionType | null) => void
  product: ProductOptionType | null
  productOptions: ProductOptionType[]
}

export const ProductSelect = ({ onProductSelect, product, productOptions }: ProductSelectProps) => {
  const onSearchChange = (newValue: ProductOptionType | string | null) => {
    if (typeof newValue === 'string') {
      onProductSelect({
        id: productOptions.length.toString(),
        title: newValue,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
    } else if (newValue && newValue.inputValue) {
      onProductSelect({
        ...newValue,
        title: newValue.inputValue,
      })
    } else {
      onProductSelect(newValue)
    }
  }

  const filterOptions = (options: ProductOptionType[], params: FilterOptionsState<ProductOptionType>) => {
    const filtered = filter(options, params)

    const { inputValue } = params
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        id: productOptions.length.toString(),
        inputValue,
        title: `Add "${inputValue}"`,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
      })
    }

    return filtered
  }

  const getOptionLabel = (option: ProductOptionType | string) => {
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
      value={product}
      onChange={(event, newValue) => onSearchChange(newValue)}
      filterOptions={filterOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id='free-solo-with-text-demo'
      options={productOptions}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: { xs: '100%', md: '60%' } }}
      freeSolo
      renderInput={(params) => <TextField {...params} label='Grocery name' />}
    />
  )
}
