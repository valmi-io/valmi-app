import React, { useState } from 'react';
import { Alert, MenuItem, Stack, Chip, Box, Popover, FormControl, TextField, Paper } from '@mui/material';

import dayjs, { Dayjs } from 'dayjs';
import VButton from '@/components/VButton';
import DateRangePickerPopover from '@/content/Prompts/DateRangePickerPopover';
import FilterListIcon from '@mui/icons-material/FilterList';

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
  resetFilters: () => void;
  searchParams?: {
    filters: string;
    timeWindow: string;
  };
}

const PromptFilter: React.FC<PromptFilterProps> = ({
  filters,
  operators: standardOperators,
  applyFilters,
  resetFilters,
  searchParams
}) => {
  console.log('Search params:_', searchParams);

  let defaultFilters: AppliedFilter[] = [];
  let defaultTimeWindow = {};

  if (searchParams?.filters) {
    defaultFilters = JSON.parse(searchParams.filters);
  }

  if (searchParams?.timeWindow) {
    defaultTimeWindow = JSON.parse(searchParams.timeWindow);
  }

  console.log('Default time window:_', defaultTimeWindow);

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'days'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [dateRange, setDateRange] = useState('last 7 days');

  const [filterInputIndex, setFilterInputIndex] = useState<number | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isCustomRangeSelected, setIsCustomRangeSelected] = React.useState<boolean>(false);

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
    if (appliedFilters.length < 1) {
      setAppliedFilters([{ column: '', column_type: '', operator: '', value: '' }]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    {
      /* delete empty filters; optional; do better, later */
    }
    const properFilters = [];
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i].column !== '' && appliedFilters[i].operator !== '' && appliedFilters[i].value !== '') {
        properFilters.push(appliedFilters[i]);
      }
    }
    setAppliedFilters(properFilters);
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

  const handleSubmit = ({
    dateRange,
    start_Date = startDate,
    end_Date = endDate
  }: {
    dateRange: string;
    start_Date: any;
    end_Date: any;
  }) => {
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
        start_date = start_Date;
        end_date = end_Date;
        break;
      default:
        console.log('nothing here...');
    }

    applyFilters(transformFilters([...combinedFilters]), dateRange, start_date, end_date);
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

  const handleCustomApplyOnClick = ({
    dateRange,
    startDate,
    endDate
  }: {
    dateRange: any;
    startDate: any;
    endDate: any;
  }) => {
    handleSubmit({ dateRange: dateRange, start_Date: startDate, end_Date: endDate });
    setIsCustomRangeSelected(false);
  };

  return (
    <Paper sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
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

          <Box minWidth={300} sx={{ display: 'flex', alignItems: 'center' }}>
            {defaultFilters.map((appliedFilter, index) => (
              <Chip
                key={index}
                label={`${appliedFilter.column} ${appliedFilter.operator} ${appliedFilter.value}`}
                onDelete={() => handleRemoveFilter(index)}
                // enable below options to edit individual filter chips
                // onClick={(event) => handleEditFilter(index, event)}
                // color={filterInputIndex === index ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DateRangePickerPopover
            dateRange={defaultTimeWindow?.label ?? ''}
            setDateRange={setDateRange}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateRangeAnchorEl={dateRangeAnchorEl}
            setDateRangeAnchorEl={setDateRangeAnchorEl}
            handleCustomApplyOnClick={handleCustomApplyOnClick}
            isCustomRangeSelected={isCustomRangeSelected}
            setIsCustomRangeSelected={setIsCustomRangeSelected}
            handleSubmit={handleSubmit}
          />
          <VButton
            buttonText={'RESET'}
            buttonType="submit"
            onClick={resetFilters}
            size="small"
            disabled={false}
            variant="text"
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
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
          />
        </Box>
      </Stack>

      {/* <FiltersStatus /> */}
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
  handleSubmit: any;
  startDate: any;
  endDate: any;
  dateRange: any;
}

const CustomPopover = ({
  anchorEl,
  handleClose,
  appliedFilters,
  setAppliedFilters,
  filters,
  standardOperators,
  handleSubmit,
  startDate,
  endDate,
  dateRange
}: PopoverParams): any => {
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
              <Stack spacing={1} direction="row" key={index}>
                <FormControl fullWidth required>
                  <TextField
                    size="small"
                    id="select-column"
                    value={appliedFilter.column}
                    label="Select Column"
                    select={true}
                    required
                    fullWidth
                    onChange={(event) => {
                      updateExistingFilter(index, 'column', event.target.value as string);
                      const filter = filters.find((filter) => filter.display_column === (event.target.value as string));
                      const columnType = filter ? filter.column_type : 'string';
                      updateExistingFilter(index, 'column_type', columnType);
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    {filters.map((filter, index) => (
                      <MenuItem key={filter.display_column} value={filter.display_column}>
                        {filter.display_column}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>

                <FormControl fullWidth required>
                  <TextField
                    size="small"
                    id="select-operator"
                    value={appliedFilter.operator}
                    label="Select Operator"
                    select={true}
                    required
                    fullWidth
                    onChange={(event) => {
                      updateExistingFilter(index, 'operator', event.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    {standardOperators[appliedFilter.column_type]?.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>

                <TextField
                  size="small"
                  value={appliedFilter.value}
                  onChange={(event) => updateExistingFilter(index, 'value', event.target.value as string)}
                  placeholder="Enter value"
                />
              </Stack>
            ))}

            <Stack spacing={1} direction="row" sx={{ justifyContent: 'space-between' }}>
              <VButton
                buttonText={'+ ADD'}
                buttonType="submit"
                endIcon={false}
                onClick={handleAddFilter}
                size="small"
                disabled={false}
                variant="text"
              />

              <Stack spacing={1} direction="row">
                <VButton
                  buttonText={'CANCEL'}
                  buttonType="submit"
                  endIcon={false}
                  startIcon={false}
                  onClick={handleClose}
                  size="small"
                  disabled={false}
                  variant="text"
                />

                <VButton
                  buttonText={'APPLY'}
                  buttonType="submit"
                  endIcon={false}
                  startIcon={false}
                  onClick={() => {
                    handleClose();
                    handleSubmit({ dateRange, startDate, endDate });
                  }}
                  size="small"
                  disabled={false}
                  variant="text"
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};
