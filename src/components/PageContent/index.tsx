import { Container } from '@mui/material';
import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
}
const PageContent = (props: PageContentProps) => {
  const { children } = props;
  return <Container maxWidth="lg">{children}</Container>;
};

export default PageContent;
