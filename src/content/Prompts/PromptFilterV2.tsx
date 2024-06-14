import React, { useState } from 'react';
import { Alert, Select, MenuItem, Button, Stack, Chip, Box, Popover, FormControl, InputLabel, TextField } from '@mui/material';
import FilterInput from './FilterInput';
import DateRangePicker, { getDateRange } from '@components/DateRangePicker';
import { transformFilters } from '@/utils/filters-transform-utils';
import CheckIcon from '@mui/icons-material/Check';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangePickerPopover from '@/content/Prompts/DateRangePickerPopover';

// Interface for filter options
interface Filter {
  db_column: string;
  display_column: string;
  column_type: string;
}

// Interface for operators
interface Operator {
  [key: string]: string[];
}

// Interface for applied filters
interface AppliedFilter {
  column: string;
  column_type: string;
  operator: string;
  value: string;
}

interface PromptFilterProps {
  filters: Filter[];
  operators: Operator;
  applyFilters: any;
}

const PromptFilter: React.FC<PromptFilterProps> = ({ filters, operators: standardOperators, applyFilters }) => {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
    { column: 'payment_method', column_type: 'string', operator: '=', value: 'xyz' },
    { column: 'payment_method', column_type: 'string', operator: '!=', value: 'as' }
  ]);

  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().subtract(7, 'days'));
  const [endDate, setEndDate]     = React.useState<Dayjs | null>(dayjs());
  const [dateRange, setDateRange] = React.useState('last7days');

  const [filterInputIndex, setFilterInputIndex] = useState<number | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleAddFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterInputIndex(appliedFilters.length);
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
    setAnchorEl(event.currentTarget);
  };

  const handleEditFilter = (index: number, event: React.MouseEvent<HTMLElement>) => {
    setFilterInputIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveFilter = (index: number) => {
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters.splice(index, 1);
    if (index === filterInputIndex) {
      handleClose();
    }

    if(filterInputIndex! > 0){
    setFilterInputIndex(filterInputIndex! - 1);
    }
    else if (newAppliedFilters.length > 0) {
      setFilterInputIndex(0);
    }
    else {
      setFilterInputIndex(null);
    }

    setAppliedFilters(newAppliedFilters);
  };

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newAppliedFilters: any = [...appliedFilters];
    newAppliedFilters[index][field] = value;
    setAppliedFilters(newAppliedFilters);
  };

  const handleColumnChange = (index: number, value: string) => {
    handleFilterChange(index, 'column', value);

    const filter = filters.find((filter) => filter.display_column === value);
    const columnType = filter ? filter.column_type : 'string';
    handleFilterChange(index, 'column_type', columnType);
  };

  const handleSubmitFilter = () => {
    if(appliedFilters[filterInputIndex!].column === '' || appliedFilters[filterInputIndex!].operator === '' || appliedFilters[filterInputIndex!].value === '')
      {
        alert('complete your filter.')
      }
      else {
      handleClose();
      }
  };

  const handleSubmit = () => {
    const combinedFilters = appliedFilters.map((filter) => {
      const correspondingFilter = filters.find((f) => f.display_column === filter.column);
      return {
        ...filter,
        column: correspondingFilter ? correspondingFilter.db_column : filter.column
      };
    });

    let start_date, end_date;
    switch(dateRange) {
      case 'last7days':
        start_date = "now() - INTERVAL '7 days'"
        end_date = "now()"
        break;
      case 'last14days':
        start_date = "now() - INTERVAL '14 days'"
        end_date = "now()"
        break;
      case 'last30days':
        start_date = "now() - INTERVAL '30 days'"
        end_date = "now()"
        break;
      case 'custom':
        start_date = startDate
        end_date = endDate
        break;
      default:
        console.log('nothing here...')

    }

    applyFilters({combinedFilters, dateRange, start_date, end_date});
  };

  const isValidFilters = () => {

    return false;
  };

  const FiltersStatus = () => {
    for(let i=0; i < appliedFilters.length; i++)
      {
        if(appliedFilters[i].column === '' || appliedFilters[i].operator === '' || appliedFilters[i].value === '')
          {
          return (
            <Alert severity="warning">Please fill your filters completely</Alert>
            );
          }
      }
      return null;
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
        <Stack spacing={1} p={1} direction="row">
            {/* appliedFilters chip box */}
            <Stack spacing={1} direction="column">
              <Box minWidth={600}>
                  {appliedFilters.map((appliedFilter, index) => (
                      <Chip
                          key={index}
                          label={`${appliedFilter.column} ${appliedFilter.operator} ${appliedFilter.value}`}
                          onDelete={() => handleRemoveFilter(index)}
                          onClick={(event) => handleEditFilter(index, event)}
                          color={filterInputIndex === index ? 'primary' : 'default'}
                      />
                  ))
                  }
              </Box>

              <CustomPopover
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                filters={filters}
                standardOperators={standardOperators}
                isList={true}
                canAdd={true} />
            </Stack>

            <DateRangePickerPopover
              dateRange={dateRange}
              setDateRange={setDateRange}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />




        </Stack>


    </>
  );
};




export default PromptFilter;


interface PopoverParams
{
  appliedFilters: AppliedFilter[],
  setAppliedFilters: any,
  filters: Filter[],
  standardOperators: Operator,
  isList: boolean,
  canAdd: boolean
}

const CustomPopover = ({appliedFilters, setAppliedFilters, filters, standardOperators, isList, canAdd}: PopoverParams): any => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = () => {
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="text" onClick={handleClick}>
        Add Filters
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{border:'1px solid black', p:2}} minWidth={600}>
          <Stack spacing={2} direction="column">
            {appliedFilters.map((appliedFilter, index) => (
              <Stack spacing={1} direction="row">
                <FormControl fullWidth required>
                  <InputLabel id="select-column-label">Select Column</InputLabel>
                  <Select
                    labelId="select-column-label"
                    id="select-column"
                    value={appliedFilter.column}
                    label="Select Column"
                    onChange={() => console.log('changing')}
                    defaultValue={appliedFilter.column}
                  >
                    {filters.map((filter, index) => (
                      <MenuItem key={filter.display_column} value={filter.display_column}>
                        {filter.display_column}
                      </MenuItem>
                    ))}

                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel id="select-operator-label">Select Operator</InputLabel>
                  <Select
                    labelId="select-operator-label"
                    id="select-operator"
                    value={appliedFilter.column}
                    label="Select Operator"
                    onChange={() => console.log('changing')}
                    defaultValue={appliedFilter.operator}
                  >
                  {standardOperators[appliedFilter.column_type]?.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
                  </Select>
                </FormControl>


                <TextField
                  value={appliedFilter.value}
                  onChange={() => console.log('changingg')}
                  placeholder="Enter value"
                />



              </Stack>
            ))}

            <Button onClick={handleAddFilter}>Add Filter</Button>
            <Button>Apply Filters</Button>
          </Stack>
        </Box>
      </Popover>
    </div>
  );

}

