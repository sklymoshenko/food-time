import { Autocomplete, FilterOptionsState, IconButton, ListItem, ListItemText, TextField } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { Product } from '../services/indexDb'
import { dayDiff } from '../services/time'
import ClearIcon from '@mui/icons-material/Clear'
import { HTMLAttributes } from 'react'
import { v4 as uuidv4 } from 'uuid'

const filter = createFilterOptions<Product>()

type ProductSelectProps = {
  onProductSelect: (product: Product | null) => void
  onProductOptionRemove: (product: Product) => void
  product: Product | null
  selectedDate: string
  productOptions: Product[]
}

type SelectOptionProps = {
  props: HTMLAttributes<HTMLElement>
  product: Product
  onRemoveOption: (option: Product) => void
}

const SelectOption = ({ props, product, onRemoveOption }: SelectOptionProps) => {
  const { date, createdAt, title } = product
  const historyDiff = dayDiff(date, createdAt)
  const defaultExpDate = `${historyDiff} days`
  const canShowHistory = !title.startsWith('Add')

  return (
    <ListItem
      {...props}
      secondaryAction={
        canShowHistory && (
          <IconButton edge='end' aria-label='clear' onClick={() => onRemoveOption(product)}>
            <ClearIcon fontSize='small' />
          </IconButton>
        )
      }
    >
      <ListItemText primary={title} secondary={canShowHistory ? `History: ${defaultExpDate}` : ''}></ListItemText>
    </ListItem>
  )
}

export const ProductSelect = ({
  onProductSelect,
  product,
  selectedDate,
  productOptions,
  onProductOptionRemove,
}: ProductSelectProps) => {
  const onSearchChange = (newValue: Product | string | null) => {
    if (typeof newValue === 'string') {
      onProductSelect({
        id: uuidv4(),
        title: newValue,
        date: selectedDate,
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

  const filterOptions = (options: Product[], params: FilterOptionsState<Product>) => {
    const filtered = filter(options, params)

    const { inputValue } = params
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        id: uuidv4(),
        inputValue,
        title: `Add "${inputValue}"`,
        createdAt: new Date().toISOString(),
        date: selectedDate,
      })
    }

    return filtered
  }

  const getOptionLabel = (option: Product | string) => {
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
      renderOption={(props, option) => (
        <SelectOption props={props} product={option} key={option.id} onRemoveOption={onProductOptionRemove} />
      )}
      sx={{ width: { xs: '100%', md: '60%' } }}
      freeSolo
      renderInput={(params) => <TextField {...params} label='Grocery name' />}
    />
  )
}
