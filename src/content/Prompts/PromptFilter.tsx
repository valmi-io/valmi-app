import React, { useState } from 'react';
import { Select, MenuItem, Button, Stack, Paper } from '@mui/material';
import FilterInput from './FilterInput';
import DateRangePicker, { getDateRange } from '@components/DateRangePicker';
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
  applyFilters: (data: AppliedFilter[]) => void;
}

const PromptFilter: React.FC<PromptFilterProps> = ({ filters, operators: standardOperators, applyFilters }) => {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [dateRange, setDateRange] = useState<{ timeRange: string; start_date: Date; end_date: Date }>(
    getDateRange('last30days')
  );
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);

  const handleDateRangeChange = (value: string) => {
    setDateRange(getDateRange(value));
  };

  const handleAddFilter = () => {
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters.splice(index, 1);
    setAppliedFilters(newAppliedFilters);
  };

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newAppliedFilters: any = [...appliedFilters];
    newAppliedFilters[index][field] = value;
    setAppliedFilters(newAppliedFilters);
  };

  const handleColumnChange = (index: number, value: string) => {
    setSelectedColumnIndex(index);
    handleFilterChange(index, 'column', value);

    const filter = filters.find((filter) => filter.display_column === value);
    const columnType = filter ? filter.column_type : 'string';
    handleFilterChange(index, 'column_type', columnType);
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
  return (
    <>
      <Stack spacing={2} p={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} setDateRange={setDateRange} />
        <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={handleAddFilter}>Add Filter</Button>
          <Button onClick={handleSubmit} disabled={!appliedFilters.length} variant="outlined">
            Apply Filters
          </Button>
        </Paper>
      </Stack>
      <Paper sx={{ display: 'flex' }}>
        {appliedFilters.map((appliedFilter, index) => (
          <Stack direction="row" spacing={2} key={index}>
            <Select value={appliedFilter.column} onChange={(e) => handleColumnChange(index, e.target.value as string)}>
              <MenuItem value="">Select Column</MenuItem>
              {filters?.map((filter) => (
                <MenuItem key={filter.display_column} value={filter.display_column}>
                  {filter.display_column}
                </MenuItem>
              ))}
            </Select>
            {selectedColumnIndex === index && (
              <>
                <Select
                  value={appliedFilter.operator}
                  onChange={(e) => handleFilterChange(index, 'operator', e.target.value as string)}
                >
                  <MenuItem value="">Select Operator</MenuItem>
                  {standardOperators[appliedFilter.column_type]?.map((op) => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
                </Select>
                <FilterInput appliedFilter={appliedFilter} index={index} handleFilterChange={handleFilterChange} />
              </>
            )}
            <Button onClick={() => handleRemoveFilter(index)}>Remove</Button>
          </Stack>
        ))}
      </Paper>
    </>
  );
};

export default PromptFilter;
