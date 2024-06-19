import { TConnection } from '@/utils/typings.d';
import { Paper, Switch, Typography, styled } from '@mui/material';

const DataFlowStatusContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  gap: '10px'
}));

const DataFlowStatusCard = ({
  handleSwitchOnChange,
  data,
  status,
  isPublicSync
}: {
  handleSwitchOnChange: (event: any, checked: boolean, data: any) => void;
  data: TConnection;
  status: string;
  isPublicSync: boolean;
}) => {
  return (
    <DataFlowStatusContainer>
      <Typography variant="body1" sx={{ color: (theme) => theme.colors.primary.main }}>
        {isPublicSync ? 'ACTIVE' : status.toUpperCase()}
      </Typography>
      {!isPublicSync && (
        <Switch
          size="medium"
          checked={!!(status === 'active')}
          onChange={(event, checked) => {
            handleSwitchOnChange(event, checked, data);
          }}
        />
      )}
    </DataFlowStatusContainer>
  );
};

export default DataFlowStatusCard;
