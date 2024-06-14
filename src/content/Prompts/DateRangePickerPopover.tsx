import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { Button, List, ListItemButton, ListItemText, Stack, Chip, Box, Popover, FormControl, InputLabel, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateRangePickerProps
{
    dateRange: string,
    setDateRange: any,
    startDate: Dayjs | null,
    endDate: Dayjs | null,
    setStartDate: (date: dayjs.Dayjs | null) => void
    setEndDate: (date: dayjs.Dayjs | null) => void
}

const DateRangePickerPopover = ({dateRange, setDateRange, startDate, endDate, setStartDate, setEndDate} : DateRangePickerProps) => {

    const possibleDateRanges = ['last7days', 'last14days', 'last30days', 'custom']
    const[anchorElement, setAnchorElement] = React.useState<HTMLButtonElement | null>(null);

    const handleDateRangeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        {/* know all contents of event ?? console.log and check */}
        setAnchorElement(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setAnchorElement(null);
    }

    const handleDateRangeChange = (possibleDateRange: string) => {

        switch(possibleDateRange) {
            case 'last7days':
                setDateRange('last7days')
                setStartDate(dayjs().subtract(7, 'days'));
                setEndDate(dayjs());
                break;
            case 'last14days':
                setDateRange('last14days')
                setStartDate(dayjs().subtract(14, 'days'));
                setEndDate(dayjs());
                break;
            case 'last30days':
                setDateRange('last30days')
                setStartDate(dayjs().subtract(30, 'days'));
                setEndDate(dayjs());
                break;
            case 'custom':
                setDateRange('custom')
                break;
            default:
                console.log('nothing here...')
        }

    }

    const open = Boolean(anchorElement);
    const id = open ? 'simple-popover' : undefined;



    return (
        <>
        <Button onClick={handleDateRangeButtonClick}>
            {dateRange}
        </Button>

        <Popover
            id={id}
            open={open}
            anchorEl={anchorElement}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
        >
            <Stack spacing={2} direction="column">
                <List
                    sx={{ width: '100%', maxWidth: 360}}
                >
                    {possibleDateRanges.map((possibleDateRange, index) => (
                        <ListItemButton onClick={() => handleDateRangeChange(possibleDateRange)}>
                            <ListItemText key={index} primary={possibleDateRange} />
                        </ListItemButton>
                    ))
                    }

                </List>

                <Stack spacing={1} direction="row">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['StaticDatePicker']}>
                            <DatePicker
                                label="start date"
                                value={startDate}

                                onChange={(newValue: dayjs.Dayjs | null) => setStartDate(newValue)}
                                readOnly={dateRange !== 'custom'}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['StaticDatePicker']}>
                            <DatePicker
                                label="end date"
                                value={endDate}
                                onChange={(newValue: dayjs.Dayjs | null) => setEndDate(newValue)}
                                readOnly={dateRange !== 'custom'}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Stack>

            </Stack>

        </Popover>


        </>
      );

}

export default DateRangePickerPopover;