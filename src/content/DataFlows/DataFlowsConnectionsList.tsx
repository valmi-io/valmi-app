import DataFlowsConnectionCard from '@/content/DataFlows/DataFlowsConnectionCard';

interface DataFlowsConnectionsListProps {
  type: string;
  data: any;
  handleOnMouseEnter: any;
  handleOnMouseLeave: any;
  onHoverState: any;
  handleConnectionOnClick: any;
  name: string;
  syncId: string;
}

const DataFlowsConnectionsList = ({
  type,
  name,
  data,
  handleConnectionOnClick,
  handleOnMouseEnter,
  handleOnMouseLeave,
  onHoverState,
  syncId
}: DataFlowsConnectionsListProps) => {
  return (
    <DataFlowsConnectionCard
      key={`${type.toLowerCase()}-${data?.id}`}
      item={name ?? ''}
      handleConnectionOnClick={handleConnectionOnClick}
      handleOnMouseEnter={handleOnMouseEnter}
      handleOnMouseLeave={handleOnMouseLeave}
      onHoverState={onHoverState}
      type={type}
      id={data?.id}
      data={data}
      syncId={syncId}
    />
  );
};

export default DataFlowsConnectionsList;
