import { Box, Stack, Typography, styled } from '@mui/material';
import CustomIcon from '@components/Icon/CustomIcon';
import { faUnsplash } from '@fortawesome/free-brands-svg-icons';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import VButton from '@/components/VButton';

const BoxLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5)
}));

type ListEmptyComponentProps = {
  description?: string;
  buttonTitle?: string;
  buttonDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ListEmptyComponent = (props: ListEmptyComponentProps) => {
  const { description = '', buttonTitle = '', buttonDisabled = false, onClick } = props;

  return (
    <BoxLayout>
      <Stack spacing={3} alignItems="center">
        <CustomIcon icon={faUnsplash} style={{ fontSize: 80 }} />
        <Typography sx={{ color: (theme) => theme.colors.alpha.black[50] }} variant="body1">
          {description}
        </Typography>
        {buttonTitle && (
          <VButton
            buttonText={buttonTitle}
            buttonType="submit"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={onClick}
            size="small"
            styles={{ mt: { xs: 2, md: 0 }, fontWeight: 'bold', fontSize: 14 }}
            disabled={buttonDisabled}
            variant="contained"
          />
        )}
      </Stack>
    </BoxLayout>
  );
};

export default ListEmptyComponent;
