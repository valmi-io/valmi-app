import React, { useState } from 'react';
import { TextField, MenuItem, Stack, Paper, Box, Button, Popover, Typography } from '@mui/material';
import PopoverComponent from '@/components/Popover'; // Adjust the import path as per your project structure
import { Dayjs } from 'dayjs';
import VButton from '@/components/VButton';

interface DateRangePickerProps {
  selectedDateRange: string;
  // setDateRange: (range: string) => void;
  // dateRangeAnchorEl: any;
  // setDateRangeAnchorEl: (el: any) => void;
  handleCustomApplyOnClick: any;
  isCustomRangeSelected: boolean;
  setIsCustomRangeSelected: any;
  handleSubmit: any;
  handleTimeWindowChange: any;
}

const possibleDateRanges = ['last 7 days', 'last 14 days', 'last 30 days', 'custom'];

const DateRangePickerPopover = ({
  selectedDateRange,
  // setDateRange,
  // dateRangeAnchorEl,
  // setDateRangeAnchorEl,
  handleCustomApplyOnClick,
  isCustomRangeSelected,
  setIsCustomRangeSelected,
  handleSubmit,
  handleTimeWindowChange
}: DateRangePickerProps) => {
  console.log('Date range popover is rendered........', selectedDateRange);

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [displayCustomPopover, setDisplayCustomPopover] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [dateRange, setDateRange] = useState('last 7 days');

  const handlePopoverClose = (): void => {
    setDisplayCustomPopover(false);
    setAnchorEl(null);
  };

  const getDateRange = (dateRange: string) => {
    let startDate = '';
    let endDate = '';

    switch (dateRange) {
      case 'last 7 days':
        startDate = "now() - INTERVAL '7 days'";
        endDate = 'now()';
        break;
      case 'last 14 days':
        startDate = "now() - INTERVAL '14 days'";
        endDate = 'now()';
        break;
      case 'last 30 days':
        startDate = "now() - INTERVAL '30 days'";
        endDate = 'now()';
        break;
    }

    return { startDate, endDate };
  };

  const handleDateRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;

    console.log('Selected value:_', selectedValue);
    setDateRange(selectedValue);

    if (selectedValue === 'custom') {
      setDisplayCustomPopover(true);
    } else {
      const { startDate = '', endDate = '' } = getDateRange(selectedValue);

      handleTimeWindowChange({
        timeWindow: {
          label: selectedValue,
          range: {
            start: startDate,
            end: endDate
          }
        }
      });
    }
  };

  const handleCustomDateRangeOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('handle custom date range', dateRange, event.currentTarget);
    if (dateRange === 'custom') {
      setDisplayCustomPopover(true);
      setAnchorEl(event.currentTarget);
    }

    // // Use a type guard to ensure the target is an HTMLButtonElement
    // if (event.currentTarget instanceof HTMLButtonElement) {
    //   setAnchorEl(event.currentTarget);
    // }
  };

  const handleCustomDateRangeChange = () => {
    setAnchorEl(null);

    console.log('Start date:_', startDate);

    console.log('end date:_', endDate);

    handleTimeWindowChange({
      timeWindow: {
        label: 'custom',
        range: {
          start: startDate,
          end: endDate
        }
      }
    });
  };

  console.log('Selected date range..............', selectedDateRange);

  const open = Boolean(anchorEl);

  const getDateRangeValue = () => {
    console.log('Selected date range:_', selectedDateRange);

    console.log('Date range:_', dateRange);

    if (dateRange === 'custom') return dateRange;
    return selectedDateRange ?? dateRange;

    // return selectedDateRange ?? dateRange ?? '';
  };

  return (
    <>
      <TextField
        size="small"
        select
        value={getDateRangeValue()}
        onChange={handleDateRangeChange}
        onClick={handleCustomDateRangeOnClick}
      >
        {possibleDateRanges.map((item: string) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      {open && (
        <PopoverComponent anchorEl={anchorEl} onClose={handlePopoverClose}>
          <Paper sx={{ padding: 1, display: 'flex' }}>
            <Box sx={{ display: 'flex', gap: (theme) => theme.spacing(1), alignItems: 'center' }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />

              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Box>
            <VButton
              buttonText={'Apply'}
              buttonType="submit"
              onClick={handleCustomDateRangeChange}
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
