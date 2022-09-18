import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { TextField, useTheme } from '@mui/material'

type ExpireDateSelectProps = {
  // Date here is a luxon DateTime object
  onDateSelect: (date: { toJSDate: () => Date } | null) => void
  date: string
}

export const ExpireDateSelect = ({ onDateSelect, date }: ExpireDateSelectProps) => {
  const theme = useTheme()
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        label='Expiration Date'
        value={date}
        inputFormat='d/M/y'
        onChange={onDateSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: { xs: '100%', md: '30%' }, marginTop: { xs: theme.spacing(2), md: '0' } }}
          />
        )}
      />
    </LocalizationProvider>
  )
}
