import React, { useState } from 'react';
import { Alert, Select, MenuItem, Button, Stack, Chip, Box, Popover, FormControl, InputLabel, TextField } from '@mui/material';
import FilterInput from './FilterInput';
import DateRangePicker, { getDateRange } from '@components/DateRangePicker';
import { transformFilters } from '@/utils/filters-transform-utils';
import CheckIcon from '@mui/icons-material/Check';


const IndividualFilterChipPopover = () => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
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
    )

}