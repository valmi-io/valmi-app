import React from 'react';
import { TextField, MenuItem, Stack, Paper, Box } from '@mui/material';
import PopoverComponent from '@/components/Popover'; // Adjust the import path as per your project structure
import { Dayjs } from 'dayjs';
import VButton from '@/components/VButton';

interface DateRangePickerProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: any) => void;
  setEndDate: (date: any) => void;
  dateRangeAnchorEl: any;
  setDateRangeAnchorEl: (el: any) => void;
  handleCustomApplyOnClick: any;
  isCustomRangeSelected: boolean;
  setIsCustomRangeSelected: any;
  handleSubmit: any;
}

const DateRangePickerPopover = ({
  dateRange,
  setDateRange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  dateRangeAnchorEl,
  setDateRangeAnchorEl,
  handleCustomApplyOnClick,
  isCustomRangeSelected,
  setIsCustomRangeSelected,
  handleSubmit
}: DateRangePickerProps) => {
  const possibleDateRanges = ['last 7 days', 'last 14 days', 'last 30 days', 'custom'];

  const handlePopoverClose = (): void => {
    setIsCustomRangeSelected(false);
  };

  const handleDateRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    if (selectedValue === 'custom') {
      setIsCustomRangeSelected(true);
      setDateRange(selectedValue);
    } else {
      setIsCustomRangeSelected(false);
      setDateRange(selectedValue);
      handleSubmit({ dateRange: selectedValue, startDate: startDate, endDate: endDate });
    }
  };

  const handleCustomDateRangeOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setDateRangeAnchorEl(event.currentTarget);
  };

  return (
    <>
      <TextField
        size="small"
        select
        value={dateRange}
        onChange={handleDateRangeChange}
        onClick={handleCustomDateRangeOnClick}
      >
        {possibleDateRanges.map((item: string) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      {isCustomRangeSelected && (
        <PopoverComponent anchorEl={dateRangeAnchorEl} onClose={handlePopoverClose}>
          <Paper sx={{ padding: 1, display: 'flex' }}>
            <Box sx={{ display: 'flex', gap: (theme) => theme.spacing(1), alignItems: 'center' }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
              />

              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
              />
            </Box>
            <VButton
              buttonText={'Apply'}
              buttonType="submit"
              onClick={() => handleCustomApplyOnClick({ dateRange, startDate, endDate })}
              size="small"
              disabled={false}
              variant="text"
            />
          </Paper>
        </PopoverComponent>
      )}
    </>
  );
};

export default DateRangePickerPopover;
