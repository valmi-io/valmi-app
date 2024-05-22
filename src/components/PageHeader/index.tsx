import PageTitleWrapper from '@/components/PageTitleWrapper';
import PageTitle from '@/components/PageTitle';
import { IButton } from '@/utils/typings.d';

export interface IPageHeaderProps {
  pageTitle: string;
  action: null | IButton;
}
const PageHeader = ({ headerProps }: { headerProps: IPageHeaderProps }) => {
  const { pageTitle, action } = headerProps;
  return (
    <PageTitleWrapper>
      <PageTitle title={pageTitle} displayButton={!!action} buttonTitle={action?.title} onClick={action?.onClick} />
    </PageTitleWrapper>
  );
};

export default PageHeader;
