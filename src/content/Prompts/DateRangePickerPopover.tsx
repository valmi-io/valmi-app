import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { Alert, Select, MenuItem, Button, List, ListItemButton, ListItemText, Stack, Chip, Box, Popover, FormControl, InputLabel, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


interface DateRangePickerProps
{
    startDate: Dayjs,
    endDate: Dayjs,
    setStartDate: any,
    setEndDate: any
}

const DateRangePickerPopover = ({startDate, endDate, setStartDate, setEndDate} : DateRangePickerProps) => {

    const [dateRange, setDateRange] = React.useState('last7days');

    const possibleDateRanges = ['last7days, last30days', 'lastmonth', 'custom']
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
                setStartDate(dayjs());
                setEndDate(dayjs().subtract(7, 'days'));
                break;
            case 'last30days':
                setDateRange('last30days')
                setStartDate(dayjs());
                setEndDate(dayjs().subtract(30, 'days'));
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
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
        >
            <Stack spacing={2} direction="column">
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'orange' }}
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
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Controlled picker"
                                value={startDate}
                                onChange={(newValue: Dayjs) => setStartDate(newValue)}
                                readOnly={dateRange !== 'custom'}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Controlled picker"
                                value={endDate}
                                onChange={(newValue: Dayjs) => setEndDate(newValue)}
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