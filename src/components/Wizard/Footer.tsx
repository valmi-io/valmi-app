import SubmitButton from '@/components/SubmitButton';
import { FormStatus } from '@/utils/form-utils';
import { Button, CardActions } from '@mui/material';

export const WizardFooter = ({
  disabled,
  prevDisabled = false,
  nextButtonTitle = 'Next',
  onNextClick,
  onPrevClick,
  status
}: {
  disabled: boolean;
  prevDisabled?: boolean;
  nextButtonTitle: 'Create' | 'Update' | 'Next';
  onNextClick: () => void;
  onPrevClick: () => void;
  status?: FormStatus;
}) => {
  return (
    <CardActions
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <SubmitButton
        buttonText={'Back'}
        data={false}
        isFetching={status === 'submitting'}
        disabled={prevDisabled}
        onClick={onPrevClick}
      />
      {/* <Button disabled={prevDisabled} color="inherit" variant="contained" onClick={onPrevClick} sx={{ mr: 1 }}>
        Back
      </Button> */}
      <SubmitButton
        buttonText={nextButtonTitle}
        data={status === 'success'}
        isFetching={status === 'submitting'}
        disabled={disabled}
        onClick={onNextClick}
      />
      {/* <Button disabled={disabled} color="inherit" variant="contained" onClick={onNextClick} sx={{ mr: 1 }}>
        {nextButtonTitle}
      </Button> */}
    </CardActions>
  );
};