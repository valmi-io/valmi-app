import React, { useState } from 'react';
import { Select, MenuItem, TextField, Button, Stack } from '@mui/material';

const PromptFilter = ({ filters, operators: standardOperators, applyFilters }: { filters: any; operators: any; applyFilters: (data: any) => void }) => {
  const [appliedFilters, setAppliedFilters] = useState<Array<{ column: string; operator: string; value: string }>>([
    { column: 'ORDER_VALUE', operator: '>=', value: '100' },
  ]);

  const [dateRange, setDateRange] = useState<{ timeRange: string; start_date: Date; end_date: Date }>({
    timeRange: 'last30days',
    start_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    end_date: new Date(),
  });

  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);

  const handleDateRangeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRange = e.target.value as string;
    let startDate = new Date();
    let endDate = new Date();

    switch (selectedRange) {
      case 'last7days':
        startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last14days':
        startDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        break;
      default:
        break;
    }

    setDateRange({ timeRange: selectedRange, start_date: startDate, end_date: endDate });
  };

  const handleAddFilter = () => {
    setAppliedFilters([...appliedFilters, { column: '', operator: '', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters.splice(index, 1);
    setAppliedFilters(newAppliedFilters);
  };

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters[index][field] = value;
    setAppliedFilters(newAppliedFilters);
  };

  const handleColumnChange = (index: number, value: string) => {
    setSelectedColumnIndex(index);
    handleFilterChange(index, 'column', value);
  };

  const handleSubmit = () => {
    const combinedFilters = [...appliedFilters,
      { column: 'updated_at', operator: '>=', value: dateRange.start_date.toISOString() },
      { column: 'updated_at', operator: '<=', value: dateRange.end_date.toISOString() }
    ];
    applyFilters(combinedFilters);
  };

  return (
    <Stack spacing={2} p={2}>

      <Stack direction="row" spacing={2}>
        <Select value={dateRange.timeRange} onChange={handleDateRangeChange}>
          <MenuItem value="last7days">Last 7 days</MenuItem>
          <MenuItem value="last14days">Last 14 days</MenuItem>
          <MenuItem value="last30days">Last 30 days</MenuItem>
          <MenuItem value="lastMonth">Last Month</MenuItem>
        </Select>
        <TextField
          label="Start Date"
          type="date"
          value={dateRange.start_date.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, start_date: new Date(e.target.value) })}
        />
        <TextField
          label="End Date"
          type="date"
          value={dateRange.end_date.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, end_date: new Date(e.target.value) })}
        />
      </Stack>

      {appliedFilters.map((appliedFilter, index) => (
        <Stack direction="row" spacing={2} key={index}>
          <Select
            value={appliedFilter.column}
            onChange={(e) => handleColumnChange(index, e.target.value as string)}
          >
            <MenuItem value="">Select Column</MenuItem>
            {filters.map((filter: any) => (
              <MenuItem key={filter.column} value={filter.column}>
                {filter.column}
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
                {standardOperators[filters.find((filter: any) => filter.column === appliedFilter.column)?.column_type]?.map((op: string) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
              {filters.find((filter: any) => filter.column === appliedFilter.column)?.column_type === 'STRING' ? (
                <TextField
                  value={appliedFilter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                  placeholder="Enter value"
                />
              ) : (
                <TextField
                  type={filters.find((filter: any) => filter.column === appliedFilter.column)?.column_type.toLowerCase()}
                  value={appliedFilter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                  placeholder={`Enter ${filters.find((filter: any) => filter.column === appliedFilter.column)?.column_type.toLowerCase()}`}
                />
              )}
            </>
          )}
          <Button onClick={() => handleRemoveFilter(index)}>Remove</Button>
        </Stack>
      ))}
      <Button onClick={handleAddFilter}>Add Filter</Button>
      <Button onClick={handleSubmit}>Apply Filters</Button>
    </Stack>
  );
};

export default PromptFilter;
