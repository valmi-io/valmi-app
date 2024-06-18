import VButton from '@/components/VButton';
import { Box, Stack, TextField, styled } from '@mui/material';
import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  handleCancel: () => void;
  handleCustomDateRangeChange: () => void;
}

const Container = styled(Stack)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1)
}));

const DateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center'
}));

const FooterStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  mt: 1
}));

const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleCancel,
  handleCustomDateRangeChange
}: DateRangePickerProps) => {
  const renderFooterButton = ({ title, onClick }: { title: string; onClick: () => void }) => {
    return (
      <VButton buttonText={title} buttonType="submit" onClick={onClick} size="small" disabled={false} variant="text" />
    );
  };

  const renderSelectComponent = ({
    label = '',
    val = '',
    onChange
  }: {
    label: string;
    val: string;
    onChange: (val: string) => void;
  }) => {
    return (
      <TextField
        label={label}
        type="date"
        value={val}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        required
      />
    );
  };
  return (
    <Container>
      <DateContainer>
        {renderSelectComponent({ label: 'Start Date', val: startDate, onChange: setStartDate })}
        {renderSelectComponent({ label: 'End Date', val: endDate, onChange: setEndDate })}
      </DateContainer>

      <FooterStack>
        {renderFooterButton({ title: 'CANCEL', onClick: handleCancel })}
        {renderFooterButton({ title: 'APPLY', onClick: handleCustomDateRangeChange })}
      </FooterStack>
    </Container>
  );
};

export default DateRangePicker;
