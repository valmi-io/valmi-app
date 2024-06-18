import { MenuItem, TextField } from '@mui/material';
import React from 'react';

const TimeGrainPickerPopover = ({
  label = '',
  value,
  handleTimeGrainChange,
  data
}: {
  label: string;
  value: string;
  handleTimeGrainChange: any;
  data: any[];
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
      value={value || 'day'}
      onChange={handleOnChange}
      InputLabelProps={{
        shrink: true
      }}
    >
      {data.length > 0
        ? data.map((item: string) => (
            <MenuItem key={item} value={item}>
              {item.toUpperCase()}
            </MenuItem>
          ))
        : []}
    </TextField>
  );
};

export default TimeGrainPickerPopover;
