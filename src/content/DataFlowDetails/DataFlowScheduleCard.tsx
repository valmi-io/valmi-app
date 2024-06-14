import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import { convertDurationToMinutesOrHours } from '@/utils/lib';
import { Paper, Typography, styled } from '@mui/material';

const Container = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  marginLeft: 3
}));

const DataFlowScheduleCard = ({ run_interval }: { run_interval: number }) => {
  return (
    <Container>
      <CustomIcon icon={appIcons.SCHEDULE} />
      <Typography variant="body2">{`Every ${convertDurationToMinutesOrHours(run_interval)}`}</Typography>

      {/* {!isPublicSync && (
          <>
            <Button
              variant="text"
              // onClick={() => handleEditSync(syncData)}
            >
              {'EDIT'}
            </Button>
          </>
        )} */}
    </Container>
  );
};

export default DataFlowScheduleCard;
