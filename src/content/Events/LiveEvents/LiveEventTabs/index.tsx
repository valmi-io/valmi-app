/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 1:00:49 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { SyntheticEvent } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LiveEvents from '@/content/Events/LiveEvents';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: any;
  onChange: (event: React.SyntheticEvent, newValue: any) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: '#19bc9b'
  }
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'grey',

  '&.Mui-selected': {
    color: theme.colors.primary.main
  },

  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)'
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

export const eventTypes = ['incoming.all', 'bulker_batch.all'];

type LiveEventsTabProps = {
  state: any;
  onChange: (event: SyntheticEvent, value: any) => void;
};

const LiveEventTabs = ({ state, onChange }: LiveEventsTabProps) => {
  const theme = useTheme();
  const {
    activeView = '',
    viewState: { incoming: { actorId: streamActorId = '' } = {}, bulker: { actorId: connectionActorId = '' } = {} } = {}
  } = state;

  let selectedValue = eventTypes.indexOf(activeView);

  return (
    <>
      <Box sx={{ width: 500 }}>
        <Box>
          <StyledTabs value={selectedValue} onChange={onChange} aria-label="styled tabs example">
            <StyledTab label="Incoming Events" />
            <StyledTab label="Destination Warhouse Events" />
          </StyledTabs>
        </Box>
      </Box>
      <TabPanel value={selectedValue} index={0} dir={theme.direction}>
        <LiveEvents
          key={`IncomingLiveEvents-${streamActorId}`}
          type={eventTypes[selectedValue]}
          actorId={streamActorId}
        />
      </TabPanel>
      <TabPanel value={selectedValue} index={1} dir={theme.direction}>
        <LiveEvents
          key={`DateWarehouseLiveEvents-${connectionActorId}`}
          type={eventTypes[selectedValue]}
          actorId={connectionActorId}
        />
      </TabPanel>
    </>
  );
};

export default LiveEventTabs;
