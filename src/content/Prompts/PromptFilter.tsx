import React, { useState } from 'react';
import { Stack, Chip, Box, Paper, Popover } from '@mui/material';

import VButton from '@/components/VButton';
import DateRangePickerPopover from '@/content/Prompts/DateRangePickerPopover';
import FilterListIcon from '@mui/icons-material/FilterList';

import { transformFilters } from '@/utils/filters-transform-utils';
import { TimeWindowType } from '@/content/Prompts/promptUtils';
import PromptPreviewFilter from '@/content/Prompts/PromptPreviewFilter';
import TimeGrainPickerPopover from '@/content/Prompts/TimeGrainPickerPopover';

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
  timeGrainEnabled?: boolean;
  timeWindowEnabled?: boolean;
  timeGrain: null | string[];
  applyFilters: any;
  applyTimeWindowFilters: any;
  applyTimeGrainFilters: any;
  resetFilters: () => void;
  searchParams?: {
    filters: string;
    timeWindow: string;
    timeGrain: string;
  };
}

const PromptFilter: React.FC<PromptFilterProps> = ({
  filters,
  operators: standardOperators,
  timeGrainEnabled = false,
  timeWindowEnabled = false,
  timeGrain,
  applyFilters,
  applyTimeWindowFilters,
  applyTimeGrainFilters,
  resetFilters,
  searchParams
}) => {
  let defaultFilters: AppliedFilter[] = [];
  let defaultTimeWindow: TimeWindowType = {
    label: '',
    range: {
      end: '',
      start: ''
    }
  };
  let appliedTimeGrain = '';

  if (searchParams?.filters) {
    defaultFilters = JSON.parse(searchParams.filters);
  }

  if (searchParams?.timeWindow) {
    defaultTimeWindow = JSON.parse(searchParams.timeWindow);
  }

  if (searchParams?.timeGrain) {
    appliedTimeGrain = JSON.parse(searchParams.timeGrain);
  }

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>(defaultFilters);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

  const handlePopoverClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void => {
    if (reason !== 'backdropClick') {
      handleClose();
    }
  };

  const handleRemoveFilter = (index: number) => {
    let indexToRemove = index; // index of the element to remove

    let newAppliedFilters = appliedFilters.filter((_, index) => index !== indexToRemove);

    console.table(newAppliedFilters);

    setAppliedFilters(transformFilters([...newAppliedFilters]));

    applyFilters({ filters: transformFilters([...newAppliedFilters]) });
  };

  const handleFiltersChange = () => {
    applyFilters({ filters: transformFilters([...appliedFilters]) });
  };

  const handleTimeWindowChange = ({
    timeWindow
  }: {
    timeWindow: {
      label: string;
      range: {
        start: string;
        end: string;
      };
    };
  }) => {
    applyTimeWindowFilters({ timeWindow: timeWindow });
  };

  const handleTimeGrainChange = ({ val }: { val: string }) => {
    applyTimeGrainFilters({ val: val });
  };

  const open = Boolean(anchorEl);

  return (
    <Paper sx={{ mt: 2 }}>
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <Box>
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
        </Box>

        <Box
          minWidth={300}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
            flexGrow: 1,
            paddingX: 1
          }}
        >
          {defaultFilters.map((appliedFilter, index) => (
            <Chip
              key={index}
              label={`${appliedFilter.column} ${appliedFilter.operator} ${appliedFilter.value}`}
              onDelete={() => handleRemoveFilter(index)}
              size="small"
              // enable below options to edit individual filter chips
              // onClick={(event) => handleEditFilter(index, event)}
              // color={filterInputIndex === index ? 'primary' : 'default'}
            />
          ))}
        </Box>

        <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          {timeGrainEnabled && Boolean(timeGrainEnabled) && (
            <TimeGrainPickerPopover
              label="Time Grain"
              value={appliedTimeGrain}
              data={timeGrain ?? []}
              handleTimeGrainChange={handleTimeGrainChange}
            />
          )}

          {timeWindowEnabled && Boolean(timeWindowEnabled) && (
            <DateRangePickerPopover
              selectedDateRange={defaultTimeWindow}
              handleTimeWindowChange={handleTimeWindowChange}
            />
          )}
          <VButton
            buttonText={'RESET'}
            buttonType="submit"
            onClick={resetFilters}
            size="small"
            disabled={false}
            variant="text"
          />
        </Stack>
      </Stack>

      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <PromptPreviewFilter
            handleClose={handleClose}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
            filters={filters}
            standardOperators={standardOperators}
            handleSubmit={handleFiltersChange}
          />
        </Popover>
      )}
    </Paper>
  );
};

export default PromptFilter;