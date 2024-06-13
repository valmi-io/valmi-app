import React, { useState } from 'react';
import { Stack, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { Xwrapper } from 'react-xarrows';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { redirectToConnectionRuns } from '@/utils/router-utils';
import { TConnection } from '@/utils/typings.d';
import DataFlowsLogo from '@/content/DataFlows/DataFlowsLogo';
import DataFlowsConnectionsList from '@/content/DataFlows/DataFlowsConnectionsList';
import DataFlowsConnectionLinks from '@/content/DataFlows/DataFlowsConnectionLinks';

const Container = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
}));

const ConnectionsContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  width: '100%'
}));

const DataFlows = ({ connections }: { connections: TConnection[] }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const [onHoverState, setOnHoverState] = useState<{ id: string }>({ id: '' });

  const handleConnectionOnClick = ({ connectionId, type }: { connectionId: string; type: string }) => {
    if (connectionId && type) {
      router.push(`${getBaseRoute(workspaceId)}/catalog/credentials?type=${type}&id=${connectionId}`);
    }
  };

  const handleLinkOnClick = ({ connId }: { connId: string }) => {
    redirectToConnectionRuns({ router, wid: workspaceId, connId: connId });
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
    <Container>
      <Xwrapper>
        <ConnectionsContainer spacing={3}>
          {connections.map((connection: TConnection) => {
            if (connection?.source?.name !== 'VALMI_ENGINE') {
              return (
                <React.Fragment key={connection?.id}>
                  <DataFlowsConnectionsList
                    data={connection?.source}
                    name={connection?.name}
                    type="SOURCE"
                    handleConnectionOnClick={handleConnectionOnClick}
                    handleOnMouseEnter={handleOnMouseEnter}
                    handleOnMouseLeave={handleOnMouseLeave}
                    onHoverState={onHoverState}
                  />
                </React.Fragment>
              );
            }
          })}
        </ConnectionsContainer>

        <DataFlowsLogo key={'logo'} />

        <ConnectionsContainer spacing={3}>
          {connections.map((connection: TConnection) => {
            if (connection?.destination?.name !== 'VALMI_ENGINE') {
              return (
                <React.Fragment key={connection?.id}>
                  <DataFlowsConnectionsList
                    data={connection?.destination}
                    name={connection?.name}
                    type="DESTINATION"
                    handleConnectionOnClick={handleConnectionOnClick}
                    handleOnMouseEnter={handleOnMouseEnter}
                    handleOnMouseLeave={handleOnMouseLeave}
                    onHoverState={onHoverState}
                  />
                </React.Fragment>
              );
            }
          })}
        </ConnectionsContainer>

        <DataFlowsConnectionLinks
          connections={connections}
          handleLinkOnClick={handleLinkOnClick}
          onHoverState={onHoverState}
          key={'Links'}
        />
      </Xwrapper>
    </Container>
  );
};

export default DataFlows;
