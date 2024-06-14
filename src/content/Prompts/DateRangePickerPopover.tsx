import { useState } from 'react';
import { TextField, MenuItem, Stack } from '@mui/material';
import PopoverComponent from '@/components/Popover';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateRangePickerProps {
  dateRange: string;
  setDateRange: any;
}

const DateRangePickerPopover = ({
  dateRange,
  setDateRange,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: DateRangePickerProps) => {
  const possibleDateRanges = ['last 7 days', 'last 14 days', 'last 30 days', 'custom'];
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState<Boolean>(false);

  const handlePopoverClose = (): void => {
    setIsCustomRangeSelected(false);
  };

  const handleDateRangeChange = (event: any) => {
    if (event.target.value === 'custom') {
      setIsCustomRangeSelected(true);
    }
    setDateRange(event.target.value);
  };
  return (
    <>
      <TextField
        size="small"
        select={true}
        value={dateRange}
        onChange={handleDateRangeChange}
        InputLabelProps={{
          shrink: true
        }}
      >
        {possibleDateRanges?.map((item: string) => {
          return (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </TextField>

      {isCustomRangeSelected && (
        <PopoverComponent anchorEl={isCustomRangeSelected} onClose={handlePopoverClose}>
          <Stack spacing={1} direction="row">
            <TextField
              label={'Start Date'}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label={'End Date'}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Stack>
        </PopoverComponent>
      )}
    </>
  );
};

export default DateRangePickerPopover;
