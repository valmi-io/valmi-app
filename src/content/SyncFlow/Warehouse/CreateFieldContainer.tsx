import { Button, styled, Grid, CircularProgress } from '@mui/material';
import FormFieldText from '@components/FormInput/FormFieldText';
import CheckIcon from '@mui/icons-material/Check';
import { ErrorStatusText } from '@/components/Error';
import { StackLayout } from '@/components/Layouts/Layouts';

const CreateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  maxWidth: 'fit-content',
  alignSelf: 'flex-end'
}));

//@ts-ignore
const CreateFieldContainer = (props) => {
  const { onSubmit, formState, handleOnChange } = props;

  const { status = 'empty', value = '', error = '', show = false } = formState ?? {};

  const handleButtonDisable = () => {
    if (status === 'submitting' || value === '') return true;
    return false;
  };

  return (
    <StackLayout>
      {show && (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8} sm={9}>
            <FormFieldText
              field={{}}
              description={''}
              fullWidth
              label="Name of the audience group to be created"
              type="text"
              required
              error={status === 'error' ? true : false}
              value={value}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} container justifyContent="flex-end">
            <CreateButton variant="contained" disabled={handleButtonDisable()} onClick={onSubmit}>
              {status === 'submitting' ? (
                <CircularProgress size={24} />
              ) : status === 'success' ? (
                <CheckIcon />
              ) : (
                'Create'
              )}
            </CreateButton>
          </Grid>
        </Grid>
      )}
      {error && <ErrorStatusText>{error}</ErrorStatusText>}
    </StackLayout>
  );
};

export default CreateFieldContainer;
