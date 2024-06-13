import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { Card, styled } from '@mui/material';

type DataFlowsConnectionCardProps = {
  type: string;
  item: any;
  handleOnMouseEnter: any;
  handleOnMouseLeave: any;
  onHoverState: any;
  handleConnectionOnClick: any;
  id: string;
  data: any;
  syncId: string;
};

const Container = styled(Card)(({ theme }) => ({
  height: 50,
  display: 'flex',
  padding: theme.spacing(0, 2),
  alignItems: 'center',
  cursor: 'pointer'
}));

const DataFlowsConnectionCard = ({
  item,
  data,
  type,
  handleConnectionOnClick,
  handleOnMouseEnter,
  handleOnMouseLeave,
  onHoverState,
  id,
  syncId
}: DataFlowsConnectionCardProps) => {
  const getConnectorImageName = ({ type = '' }: { type: string }) => {
    if (type) {
      return type.split('_')[1].toLowerCase();
    } else return '';
  };
  return (
    <Container
      onMouseEnter={() => {
        handleOnMouseEnter({ id: id });
      }}
      onMouseLeave={handleOnMouseLeave}
      variant="outlined"
      sx={{
        borderWidth: onHoverState.id === id ? 2 : 1,
        borderColor: (theme) => (onHoverState.id === id ? theme.colors.secondary.main : '#E0E0E0')
      }}
      onClick={() =>
        handleConnectionOnClick({
          connectionId: (type === 'SOURCE' && data?.credential?.id) || (type === 'DESTINATION' && syncId),
          type: data?.credential?.display_name.toLowerCase(),
          catalogType: type
        })
      }
      id={id}
    >
      <ImageComponent
        title={item}
        src={`/connectors/${getConnectorImageName({ type: data?.credential?.connector_type })}.svg`}
        size={ImageSize.medium}
        alt={`connectionIcon`}
        style={{ marginRight: '8px' }}
      />
    </Container>
  );
};

export default DataFlowsConnectionCard;
