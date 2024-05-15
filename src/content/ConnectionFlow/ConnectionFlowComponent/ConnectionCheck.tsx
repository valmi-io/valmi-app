import { FormStatus } from '@/utils/form-utils';
import { CheckOutlined, ErrorOutline } from '@mui/icons-material';
import { Box, CircularProgress, styled } from '@mui/material';

export type TConnectionCheckState = {
  error: string;
  status: FormStatus;
};

const Item = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ConnectionCheck = ({
  state: { error = '', status = 'empty' },
  isDiscovering
}: {
  state: TConnectionCheckState;
  isDiscovering: any;
}) => {
  if (status === 'empty' || !status) return null;
  const isFetching = !!(status === 'submitting');

  return (
    <Item>
      {isFetching ? (
        <Item>
          <CircularProgress size={20} sx={{ mx: 1 }} />
          <p>Testing connection...</p>
        </Item>
      ) : isDiscovering ? (
        <Item>
          <CircularProgress size={20} sx={{ mx: 1 }} />
          <p>Discovering objects from connection...</p>
        </Item>
      ) : (
        <>
          {status === 'error' && <ErrorOutline color="error" sx={{ mx: 1 }} />}
          {status === 'success' && <CheckOutlined color="primary" sx={{ mx: 1 }} />}
          <p>{status === 'error' ? error : 'Test success'}</p>
        </>
      )}
    </Item>
  );
};

export default ConnectionCheck;
