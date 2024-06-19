import PageTitle from '@/components/PageTitle';
import { IButton } from '@/utils/typings.d';

export interface IPageHeaderProps {
  pageTitle: string;
  action: null | IButton;
}
const PageHeader = ({ headerProps }: { headerProps: IPageHeaderProps }) => {
  const { pageTitle, action } = headerProps;
  return <PageTitle title={pageTitle} displayButton={!!action} buttonTitle={action?.title} onClick={action?.onClick} />;
};

export default PageHeader;
