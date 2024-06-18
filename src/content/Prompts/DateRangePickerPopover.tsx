import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import PopoverComponent from '@/components/Popover'; // Adjust the import path as per your project structure
import { TimeWindowType } from '@/content/Prompts/promptUtils';
import { getCurrentDate, getLastNthDate } from '@/utils/date-utils';
import DateRangePicker from '@/components/DateRangePicker';

interface DateRangePickerProps {
  selectedDateRange: TimeWindowType;
  handleTimeWindowChange: any;
}

const possibleDateRanges = ['last 7 days', 'last 14 days', 'last 30 days', 'custom'];

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
    case 'custom':
      startDate = getLastNthDate(6);
      endDate = getCurrentDate();
  }

  return { startDate, endDate };
};

const DateRangePickerPopover = ({ selectedDateRange, handleTimeWindowChange }: DateRangePickerProps) => {
  const {
    label = '',
    range: { start = '', end = '' }
  } = selectedDateRange ?? {};

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void => {
    if (reason !== 'backdropClick') {
      setAnchorEl(null);
    }
  };

  const handleDateRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;

    if (selectedValue === 'custom') {
      setStartDate('');
      setEndDate('');
    }

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
  };

  const handleDateRangeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const selectedItem = target.innerText ?? '';

    if (selectedItem === 'custom') {
      setAnchorEl(event.currentTarget as HTMLElement);
    }
  };

  const getStartDateValue = () => {
    return startDate || start;
  };

  const getEndDateValue = () => {
    return endDate || end;
  };

  const handleCustomDateRangeChange = () => {
    setAnchorEl(null);

    handleTimeWindowChange({
      timeWindow: {
        label: 'custom',
        range: {
          start: getStartDateValue(),
          end: getEndDateValue()
        }
      }
    });
  };

  const open = Boolean(label === 'custom' && anchorEl);

  const handleCancel = () => {
    setStartDate('');
    setEndDate('');
    setAnchorEl(null);
  };

  return (
    <>
      <TextField size="small" select value={label} onChange={handleDateRangeChange} onClick={handleDateRangeClick}>
        {possibleDateRanges.map((item: string) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      {open && (
        <PopoverComponent anchorEl={anchorEl} onClose={handlePopoverClose}>
          <DateRangePicker
            key={'preview-datepicker'}
            startDate={getStartDateValue()}
            endDate={getEndDateValue()}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleCancel={handleCancel}
            handleCustomDateRangeChange={handleCustomDateRangeChange}
          />
        </PopoverComponent>
      )}
    </>
  );
};

export default DateRangePickerPopover;