import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { TextField, useTheme } from '@mui/material'
import { dayDiff } from '../services/time'

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
        inputFormat='dd/MM/y'
        disablePast
        shouldDisableDate={(day) => !dayDiff(day.toJSDate().toISOString(), new Date().toISOString())}
        onChange={onDateSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: { xs: '100%', md: '15%' }, marginTop: { xs: theme.spacing(2), md: '0' } }}
          />
        )}
      />
    </LocalizationProvider>
  )
}
