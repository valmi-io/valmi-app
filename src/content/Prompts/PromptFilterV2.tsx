import React, { useState } from 'react';
import {
  Alert,
  Select,
  MenuItem,
  Button,
  Stack,
  Chip,
  Box,
  Popover,
  FormControl,
  InputLabel,
  TextField,
  Paper
} from '@mui/material';

import dayjs, { Dayjs } from 'dayjs';
import VButton from '@/components/VButton';
import DateRangePickerPopover from '@/content/Prompts/DateRangePickerPopover';
import FilterListIcon from '@mui/icons-material/FilterList';
import PopoverComponent from '@/components/Popover';
import { transformFilters } from '@/utils/filters-transform-utils';

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

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().subtract(7, 'days'));
  const [dateRange, setDateRange] = useState('last 7 days');

  const [filterInputIndex, setFilterInputIndex] = useState<number | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleAddFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterInputIndex(appliedFilters.length);
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
    setAnchorEl(event.currentTarget);
  };

  const handleEditFilter = (index: number, event: React.MouseEvent<HTMLElement>) => {
    setFilterInputIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

    if (filterInputIndex! > 0) {
      setFilterInputIndex(filterInputIndex! - 1);
    } else if (newAppliedFilters.length > 0) {
      setFilterInputIndex(0);
    } else {
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
    if (
      appliedFilters[filterInputIndex!].column === '' ||
      appliedFilters[filterInputIndex!].operator === '' ||
      appliedFilters[filterInputIndex!].value === ''
    ) {
      alert('complete your filter.');
    } else {
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
    switch (dateRange) {
      case 'last 7 days':
        start_date = "now() - INTERVAL '7 days'";
        end_date = 'now()';
        break;
      case 'last 14 days':
        start_date = "now() - INTERVAL '14 days'";
        end_date = 'now()';
        break;
      case 'last 30 days':
        start_date = "now() - INTERVAL '30 days'";
        end_date = 'now()';
        break;
      case 'custom':
        start_date = startDate;
        end_date = endDate;
        break;
      default:
        console.log('nothing here...');
    }

    applyFilters(transformFilters([...combinedFilters]), dateRange, start_date, end_date);
  };

  const isValidFilters = () => {
    return false;
  };

  const FiltersStatus = () => {
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i].column === '' || appliedFilters[i].operator === '' || appliedFilters[i].value === '') {
        return <Alert severity="warning">Please fill your filters completely</Alert>;
      }
    }
    return null;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Paper sx={{ border: '2px solid greenyellow' }}>
      <Box sx={{ display: 'flex', gap: 2, bgcolor: 'yellow', justifyContent: 'space-between' }}>
        <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <VButton
            buttonText={'FILTERS'}
            buttonType="submit"
            endIcon={false}
            startIcon={<FilterListIcon />}
            onClick={handleClick}
            size="small"
            disabled={false}
            variant="contained"
          />

          <Box minWidth={600}>
            {appliedFilters.map((appliedFilter, index) => (
              <Chip
                key={index}
                label={`${appliedFilter.column} ${appliedFilter.operator} ${appliedFilter.value}`}
                onDelete={() => handleRemoveFilter(index)}
                onClick={(event) => handleEditFilter(index, event)}
                color={filterInputIndex === index ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Stack>

        <Box sx={{}}>
          <DateRangePickerPopover
            dateRange={dateRange}
            setDateRange={setDateRange}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </Box>
      </Box>

      <Stack spacing={2} p={2} direction="row" alignItems="center">
        <Box flex={1}>
          <CustomPopover
            anchorEl={anchorEl}
            handleClose={handleClose}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
            filters={filters}
            standardOperators={standardOperators}
            handleSubmit={handleSubmit}
          />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            setDateRange={setDateRange}
          /> */}
        </Stack>
      </Stack>

      <FiltersStatus />
    </Paper>
  );
};

export default PromptFilter;

interface PopoverParams {
  anchorEl: any;
  handleClose: any;
  appliedFilters: AppliedFilter[];
  setAppliedFilters: () => void;
  filters: Filter[];
  standardOperators: Operator;
  handleSubmit: () => void;
}

const CustomPopover = ({
  anchorEl,
  handleClose,
  appliedFilters,
  setAppliedFilters,
  filters,
  standardOperators,
  handleSubmit
}: PopoverParams): any => {
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const updateExistingFilter = (index: number, field: any, value: string) => {
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters[index][field] = value;
    setAppliedFilters(newAppliedFilters);
  };

  const handleAddFilter = () => {
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      {/* <Button aria-describedby={id} variant="text" onClick={handleClick} sx={{ bgcolor: 'yellow' }}>
        Add Filters
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ border: '1px solid black', p: 2 }} minWidth={600}>
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
                    onChange={(event) => {
                      updateExistingFilter(index, 'column', event.target.value as string);
                      const filter = filters.find((filter) => filter.display_column === (event.target.value as string));
                      const columnType = filter ? filter.column_type : 'string';
                      updateExistingFilter(index, 'column_type', columnType);
                    }}
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
                    value={appliedFilter.operator}
                    label="Select Operator"
                    onChange={(event) => {
                      updateExistingFilter(index, 'operator', event.target.value);
                    }}
                    defaultValue={appliedFilter.operator}
                  >
                    {standardOperators[appliedFilter.column_type]?.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel id="select-operator-label">Select Operator</InputLabel>
                  <Select
                    labelId="select-operator-label"
                    id="select-operator"
                    value={appliedFilter.operator}
                    label="Select Operator"
                    onChange={(event) => {
                      updateExistingFilter(index, 'operator', event.target.value);
                    }}
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
                  sx={{ width: 800 }}
                  value={appliedFilter.value}
                  onChange={(event) => updateExistingFilter(index, 'value', event.target.value as string)}
                  placeholder="Enter value"
                />
              </Stack>
            ))}

            <Stack spacing={1} direction="row">
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddFilter}>Add Filter</Button>
              <Button
                onClick={() => {
                  handleClose();
                  handleSubmit();
                }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};
