import { Autocomplete, FilterOptionsState, IconButton, ListItem, ListItemText, TextField } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { dayDiff } from '../services/time'
import ClearIcon from '@mui/icons-material/Clear'
import { HTMLAttributes } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Product } from '../types'
import { DateTime } from 'luxon'

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

export const onSearchChange = (
  newValue: Product | string,
  onProductSelect: ProductSelectProps['onProductSelect'],
  id?: string,
  selectedDate?: ProductSelectProps['selectedDate'],
) => {
  if (typeof newValue === 'string' && id && selectedDate) {
    onProductSelect({
      id,
      title: newValue,
      date: selectedDate,
      createdAt: DateTime.now().toISODate(),
    })
  } else if (typeof newValue === 'object' && newValue.inputValue) {
    onProductSelect({
      ...newValue,
      title: newValue.inputValue,
      id: '',
    })
  } else if (typeof newValue === 'object') {
    onProductSelect({ ...newValue, id: '' })
  }
}

export const filterOptions = (
  options: Product[],
  params: FilterOptionsState<Product>,
  selectedDate: ProductSelectProps['selectedDate'],
) => {
  const filtered = filter(options, params)
  const { inputValue } = params
  // Suggest the creation of a new value
  const isExisting = options.some((option) => inputValue === option.title)
  if (inputValue !== '' && !isExisting) {
    filtered.push({
      id: uuidv4(),
      inputValue,
      title: `Add "${inputValue}"`,
      createdAt: DateTime.now().toISODate(),
      date: selectedDate,
    })
  }

  return filtered
}

export const getOptionLabel = (option: Product | string) => {
  if (typeof option === 'string') {
    return option
  }

  if (option.inputValue) {
    return option.inputValue
  }

  return option.title
}

export const SelectOption = ({ props, product, onRemoveOption }: SelectOptionProps) => {
  const { date, createdAt, title } = product
  const historyDiff = dayDiff(date, createdAt)
  const defaultExpDate = `${historyDiff} days`
  const canShowHistory = !title.startsWith('Add')

  return (
    <ListItem
      {...props}
      secondaryAction={
        canShowHistory && (
          <IconButton
            data-testid='optionRemoveButton'
            edge='end'
            aria-label='clear'
            onClick={() => onRemoveOption(product)}
          >
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
  return (
    <Autocomplete
      data-testid='productSelect'
      value={product}
      onChange={(event, newValue) => onSearchChange(newValue!, onProductSelect, uuidv4(), selectedDate)}
      filterOptions={(options, porams) => filterOptions(options, porams, selectedDate)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
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
