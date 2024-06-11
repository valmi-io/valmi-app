import React from 'react';
import { TextField } from '@mui/material';

interface AppliedFilter {
    column: string;
    column_type: string;
    operator: string;
    value: string;
  }

interface FilterInputProps {
  appliedFilter: AppliedFilter;
  index: number;
  handleFilterChange: (index: number, field: string, value: string) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ appliedFilter, index, handleFilterChange }) => {
  const getInputField = () => {
    switch (appliedFilter.column_type.toLowerCase()) {
      case 'string':
        return (
          <TextField
            value={appliedFilter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            placeholder="Enter value"
          />
        );

      case 'integer':
        return (
          <TextField
            type="number"
            value={appliedFilter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            placeholder="Enter integer"
            inputProps={{ step: '1' }}
          />
        );

      case 'date':
        return (
          <TextField
            type="date"
            value={appliedFilter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            placeholder="Enter date"
          />
        );

      // Add other cases as needed
      default:
        return (
          <TextField
            value={appliedFilter.value}
            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            placeholder={`Enter ${appliedFilter.column_type.toLowerCase()}`}
          />
        );
    }
  };

  return <>{getInputField()}</>;
};

export default FilterInput;
