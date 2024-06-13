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
  TextField
} from '@mui/material';
import FilterInput from './FilterInput';
import DateRangePicker, { getDateRange } from '@components/DateRangePicker';
import { transformFilters } from '@/utils/filters-transform-utils';
import CheckIcon from '@mui/icons-material/Check';

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
  applyFilters: (data: AppliedFilter[]) => void;
}

const PromptFilter: React.FC<PromptFilterProps> = ({ filters, operators: standardOperators, applyFilters }) => {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
    { column: 'payment_method', column_type: 'string', operator: '=', value: 'xyz' },
    { column: 'payment_method', column_type: 'string', operator: '!=', value: 'as' }
  ]);
  const [dateRange, setDateRange] = useState<{ timeRange: string; start_date: Date; end_date: Date }>(
    getDateRange('last30days')
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterInputIndex, setFilterInputIndex] = useState<number | null>(null);

  const handleDateRangeChange = (value: string) => {
    setDateRange(getDateRange(value));
  };

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

    const dateRangeFilters = [
      { column: 'updated_at', column_type: 'DATE', operator: '>=', value: dateRange.start_date.toISOString() },
      { column: 'updated_at', column_type: 'DATE', operator: '<=', value: dateRange.end_date.toISOString() }
    ];

    applyFilters(transformFilters([...combinedFilters, ...dateRangeFilters]));
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
    <>
      <Stack spacing={2} p={2} direction="row" alignItems="center">
        <Box flex={1}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {appliedFilters.map((appliedFilter, index) => (
              <Chip
                key={index}
                label={`${appliedFilter.column} ${appliedFilter.operator} ${appliedFilter.value}`}
                onDelete={() => handleRemoveFilter(index)}
                onClick={(event) => handleEditFilter(index, event)}
                color={filterInputIndex === index ? 'primary' : 'default'}
              />
            ))}
          </Stack>
          <CustomPopover
            appliedFilters={appliedFilters}
            filters={filters}
            standardOperators={standardOperators}
            isList={true}
            canAdd={true}
          />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            setDateRange={setDateRange}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Apply Filters
          </Button>
        </Stack>
      </Stack>

      <FiltersStatus />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {filterInputIndex !== null && (
          <Box p={2} minWidth={400} display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Select Column</InputLabel>
              <Select
                label="Select Column"
                value={appliedFilters[filterInputIndex].column}
                onChange={(e) => handleColumnChange(filterInputIndex, e.target.value as string)}
              >
                <MenuItem value="">Select Column</MenuItem>
                {filters.map((filter) => (
                  <MenuItem key={filter.display_column} value={filter.display_column}>
                    {filter.display_column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Select Operator</InputLabel>
              <Select
                label="Select Operator"
                value={appliedFilters[filterInputIndex].operator}
                onChange={(e) => handleFilterChange(filterInputIndex, 'operator', e.target.value as string)}
              >
                <MenuItem value="">Select Operator</MenuItem>
                {standardOperators[appliedFilters[filterInputIndex].column_type]?.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FilterInput
              appliedFilter={appliedFilters[filterInputIndex]}
              index={filterInputIndex}
              handleFilterChange={handleFilterChange}
            />
            <Button onClick={handleSubmitFilter} variant="contained" color="primary" fullWidth>
              OK
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default PromptFilter;

interface PopoverParams {
  appliedFilters: AppliedFilter[];
  filters: Filter[];
  standardOperators: Operator;
  isList: boolean;
  canAdd: boolean;
}

const CustomPopover = ({ appliedFilters, filters, standardOperators, isList, canAdd }: PopoverParams): any => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

            <Button>Add Filter</Button>
            <Button>Apply Filters</Button>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};
