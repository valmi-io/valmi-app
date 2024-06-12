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
  type,
  handleConnectionOnClick,
  handleOnMouseEnter,
  handleOnMouseLeave,
  onHoverState,
  id
}: DataFlowsConnectionCardProps) => {
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
      onClick={() => handleConnectionOnClick({ connectionId: id })}
      id={id}
    >
      <ImageComponent
        title={item}
        src={`/connectors/${type.toLowerCase()}.svg`}
        size={ImageSize.medium}
        alt={`connectionIcon`}
        style={{ marginRight: '8px' }}
      />
    </Container>
  );
};

export default DataFlowsConnectionCard;
