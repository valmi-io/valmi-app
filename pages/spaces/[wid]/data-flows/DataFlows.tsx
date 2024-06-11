import { useState } from 'react';
import { Box, Card, Stack, Tooltip, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import Image from 'next/image';
import Xarrow, { Xwrapper } from 'react-xarrows';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';

type ConnectionLayoutProps = {
  type: string;
  data: any;
  handleOnMouseEnter: any;
  handleOnMouseLeave: any;
  onHoverState: any;
  handleConnectionOnClick: any;
  name: string;
};

type ConnectionItemProps = {
  type: string;
  item: any;
  handleOnMouseEnter: any;
  handleOnMouseLeave: any;
  onHoverState: any;
  handleConnectionOnClick: any;
  id: string;
};

const ConnectionLayout = ({
  type,
  name,
  data,
  handleConnectionOnClick,
  handleOnMouseEnter,
  handleOnMouseLeave,
  onHoverState
}: ConnectionLayoutProps) => {
  return (
    <ConnectionItem
      key={`${type.toLowerCase()}-${data?.id}`}
      item={name ?? ''}
      handleConnectionOnClick={handleConnectionOnClick}
      handleOnMouseEnter={handleOnMouseEnter}
      handleOnMouseLeave={handleOnMouseLeave}
      onHoverState={onHoverState}
      type={data?.name}
      id={data?.id}
    />
  );
};

const ConnectionItem = ({
  item,
  type,
  handleConnectionOnClick,
  handleOnMouseEnter,
  handleOnMouseLeave,
  onHoverState,
  id
}: ConnectionItemProps) => {
  return (
    <Card
      onMouseEnter={() => {
        handleOnMouseEnter({ id: id });
      }}
      onMouseLeave={handleOnMouseLeave}
      variant="outlined"
      style={{
        display: 'flex',
        height: 62,
        cursor: 'pointer',
        alignItems: 'center'
      }}
      onClick={() => handleConnectionOnClick({ id })}
      id={id}
    >
      <ImageComponent
        title={item}
        src={`/connectors/${type.toLowerCase()}.svg`}
        size={ImageSize.medium}
        alt={`connectionIcon`}
        style={{ marginRight: '10px' }}
      />
    </Card>
  );
};

const DataFlows = ({ syncs }: { syncs: any }) => {
  const router = useRouter();

  const theme = useTheme();

  const { workspaceId = '' } = useWorkspaceId();

  const [onHoverState, setOnHoverState] = useState<{ id: string }>({ id: '' });

  const LineArrow = ({
    from,
    to,
    selected = false,
    syncId
  }: {
    from: string;
    to: string;
    selected?: boolean;
    syncId: string;
  }) => {
    return (
      <Xarrow
        passProps={{
          onClick: () => handleLinkOnClick({ syncId: syncId }),
          cursor: 'pointer'
        }}
        showHead={false}
        lineColor={selected ? theme.colors.secondary.main : theme.colors.secondary.lighter}
        strokeWidth={5}
        key={`stream${from + to}`}
        start={from}
        end={to}
      />
    );
  };

  const isHighlighted = (fromId: string, toId: string) => {
    if (!onHoverState.id) return false;
    const hoveredId = onHoverState.id;
    // get links of this id
    // highlight these links
    const linksForThisObject: any[] = [];
    syncs.map((connection: any) => {
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

  const linkConnections = () => {
    return getLines().map((line, idx) => (
      <LineArrow
        key={`linearrow-${line.from + line.to + idx}`}
        selected={isHighlighted(line.from, line.to)}
        from={line.from}
        to={line.to}
        syncId={line.syncId}
      />
    ));
  };

  const getLines = () => {
    const lines: { from: any; to: any; selected?: boolean; syncId: string }[] = [];
    const logoId = 'logo';
    syncs.forEach((sync: any) => {
      const fromId = sync?.source?.name !== 'VALMI_ENGINE' && sync?.source?.id;
      const toId = sync?.source?.name === 'VALMI_ENGINE' && sync?.destination?.id;
      const syncId = sync?.id;

      if (fromId) {
        lines.push({
          from: fromId,
          to: logoId,
          syncId: syncId
        });
      }
      if (toId) {
        lines.push({
          from: logoId,
          to: toId,
          syncId: syncId
        });
      }
    });
    return lines;
  };

  const handleLogoOnClick = () => {
    router.push(`${getBaseRoute(workspaceId)}/data-flows/connections`);
  };

  const handleConnectionOnClick = ({ id }: { id: string }) => {
    if (id) {
      router.push(`${getBaseRoute(workspaceId)}/data-flows/connections`);
    }
  };

  const handleLinkOnClick = ({ syncId }: { syncId: string }) => {
    if (syncId) {
      router.push(`${getBaseRoute(workspaceId)}/data-flows/${syncId}/runs`);
    }
  };

  const handleOnMouseEnter = ({ id }: { id: string }) => {
    if (onHoverState.id !== id) {
      setOnHoverState({ id: id });
    }
  };

  const handleOnMouseLeave = () => {
    setOnHoverState({ id: '' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Xwrapper>
        <Stack spacing={2} sx={{ display: 'flex', width: '100%', mt: 1 }}>
          {syncs.map((connection: any) => {
            if (connection?.source?.name !== 'VALMI_ENGINE') {
              return (
                <ConnectionLayout
                  data={connection?.source}
                  name={connection?.name}
                  type="SOURCE"
                  handleConnectionOnClick={handleConnectionOnClick}
                  handleOnMouseEnter={handleOnMouseEnter}
                  handleOnMouseLeave={handleOnMouseLeave}
                  onHoverState={onHoverState}
                />
              );
            }
          })}
        </Stack>

        <Stack
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Tooltip title="connections">
            <Image
              id="logo"
              priority={true}
              src="/images/valmi_logo_no_text.svg"
              alt="Logo"
              width={60}
              height={60}
              onClick={handleLogoOnClick}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </Stack>

        <Stack spacing={2} sx={{ display: 'flex', width: '100%', mt: 1 }}>
          {syncs.map((connection: any) => {
            if (connection?.source?.name === 'VALMI_ENGINE') {
              return (
                <ConnectionLayout
                  data={connection?.destination}
                  name={connection?.name}
                  type="DESTINATION"
                  handleConnectionOnClick={handleConnectionOnClick}
                  handleOnMouseEnter={handleOnMouseEnter}
                  handleOnMouseLeave={handleOnMouseLeave}
                  onHoverState={onHoverState}
                />
              );
            }
          })}
        </Stack>
        {linkConnections()}
      </Xwrapper>
    </Box>
  );
};

export default DataFlows;
