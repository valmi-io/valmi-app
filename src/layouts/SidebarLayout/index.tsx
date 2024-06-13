import { FC, ReactNode } from 'react';
import { Stack, alpha, styled } from '@mui/material';
import PropTypes from 'prop-types';
import Sidebar from '@layouts/SidebarLayout/Sidebar';
import Header from '@layouts/SidebarLayout/Header';

// Define the properties for the layout component
interface LayoutProps {
  children?: ReactNode;
}

// Root container styling for the entire layout
const LayoutRoot = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%'
}));

// Main container styling which holds the content and header
const MainContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  width: '100%',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    marginLeft: `${theme.sidebar.width}` // Adds margin to accommodate sidebar width on large screens
  }
}));

// Wrapper for the main content area
const ContentWrapper = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  width: '100%',
  alignItems: 'center',
  maxWidth: '1320px'
}));

// Wrapper for the header to style it properly
const HeaderWrapper = styled(Stack)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: theme.header.height,
  backgroundColor: alpha(theme.header.background!, 0.95)
}));

// Main layout component
const SidebarLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutRoot>
      <Sidebar />
      <MainContainer>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </MainContainer>
    </LayoutRoot>
  );
};

// Define the type of children prop
SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;
