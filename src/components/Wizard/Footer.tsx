import { Button, CardActions } from '@mui/material';

export const WizardFooter = ({
  disabled,
  prevDisabled = false,
  nextButtonTitle = 'Next',
  onNextClick,
  onPrevClick
}: {
  disabled: boolean;
  prevDisabled?: boolean;
  nextButtonTitle: 'Create' | 'Update' | 'Next';
  onNextClick: () => void;
  onPrevClick: () => void;
}) => {
  return (
    <CardActions
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Button disabled={prevDisabled} color="inherit" variant="contained" onClick={onPrevClick} sx={{ mr: 1 }}>
        Back
      </Button>
      <Button disabled={disabled} color="inherit" variant="contained" onClick={onNextClick} sx={{ mr: 1 }}>
        {nextButtonTitle}
      </Button>
    </CardActions>
  );
};
