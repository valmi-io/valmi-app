import { TConnection } from '@/utils/typings.d';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import Xarrow from 'react-xarrows';

const getLines = ({ connections }: { connections: TConnection[] }) => {
  const lines: { from: any; to: any; selected?: boolean; connId: string }[] = [];
  const logoId = 'logo';
  connections.forEach((connection: TConnection) => {
    const fromId = connection?.source?.name !== 'VALMI_ENGINE' && connection?.source?.id;
    const toId = connection?.source?.name === 'VALMI_ENGINE' && connection?.destination?.id;
    const connId = connection?.id;

    if (fromId) {
      lines.push({
        from: fromId,
        to: logoId,
        connId: connId
      });
    }
    if (toId) {
      lines.push({
        from: logoId,
        to: toId,
        connId: connId
      });
    }
  });
  return lines;
};

const LineArrow = ({
  from,
  to,
  selected = false,
  connId,
  handleLinkOnClick
}: {
  from: string;
  to: string;
  selected?: boolean;
  connId: string;
  handleLinkOnClick: (data: { connId: string }) => void;
}) => {
  const theme = useTheme();

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleArrowOnClick = () => {
    handleLinkOnClick({ connId: connId });
  };

  return (
    <Xarrow
      passProps={{
        onClick: handleArrowOnClick,
        cursor: 'pointer',
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }}
      showHead={false}
      lineColor={
        selected
          ? theme.colors.secondary.main
          : isHovered
          ? theme.colors.secondary.main
          : theme.colors.secondary.lighter
      }
      strokeWidth={5}
      key={`stream${from + to}`}
      start={from}
      end={to}
    />
  );
};

const DataFlowsConnectionLinks = ({
  connections,
  handleLinkOnClick,
  onHoverState
}: {
  connections: TConnection[];
  onHoverState: { id: string };
  handleLinkOnClick: (data: { connId: string }) => void;
}) => {
  const isHighlighted = (fromId: string, toId: string) => {
    if (!onHoverState.id) return false;
    const hoveredId = onHoverState.id;
    // get links of this id
    // highlight these links
    const linksForThisObject: any[] = [];
    connections.map((connection: any) => {
      if (connection?.source?.id === hoveredId || connection?.destination?.id === hoveredId) {
        linksForThisObject.push(connection);
      }
    });

    for (let i = 0; i < linksForThisObject.length; i++) {
      const link = linksForThisObject[i];
      if (link?.source?.id === fromId || link?.destination?.id === toId) {
        return true;
      }
    }

    return false;
  };

  return getLines({ connections }).map((line, idx) => (
    <LineArrow
      key={`linearrow-${line.from + line.to + idx}`}
      selected={isHighlighted(line.from, line.to)}
      from={line.from}
      to={line.to}
      connId={line.connId}
      handleLinkOnClick={handleLinkOnClick}
    />
  ));
};

export default DataFlowsConnectionLinks;
