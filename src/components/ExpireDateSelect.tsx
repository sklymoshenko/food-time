import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { TextField, useTheme } from '@mui/material'

type ExpireDateSelectProps = {
  onDateSelect: (date: Date | null) => void
  date: Date
}

export const ExpireDateSelect = ({ onDateSelect, date }: ExpireDateSelectProps) => {
  const theme = useTheme()
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        label='Basic example'
        value={date}
        onChange={onDateSelect}
        renderInput={(params) => (
          <TextField {...params} sx={{ width: { xs: '100%', md: '30%' }, marginTop: { xs: theme.spacing(2) } }} />
        )}
      />
    </LocalizationProvider>
  )
}
