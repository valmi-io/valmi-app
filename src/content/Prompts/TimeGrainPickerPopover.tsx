import { MenuItem, TextField } from '@mui/material';
import React from 'react';

const possibleRanges = ['DAY', 'WEEK', 'MONTH'];

const TimeGrainPickerPopover = ({
  label = '',
  value,
  handleTimeGrainChange
}: {
  label: string;
  value: string;
  handleTimeGrainChange: any;
}) => {
  const handleOnChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;

    handleTimeGrainChange({
      val: selectedValue
    });
  };

  return (
    <TextField
      size="small"
      label={label}
      select
      value={value || 'DAY'}
      onChange={handleOnChange}
      InputLabelProps={{
        shrink: true
      }}
    >
      {possibleRanges.map((item: string) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TimeGrainPickerPopover;
