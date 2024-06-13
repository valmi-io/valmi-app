import React, { ReactElement } from 'react';

import SidebarLayout from '@layouts/SidebarLayout';

import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';

import ConnectionFlowComponent from '@/content/ConnectionFlow/ConnectionFlowComponent';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/data-flows/create';

const DataflowEditPageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <DataflowEditPage params={params} />;
};

const DataflowEditPage = ({ params }: TConnectionUpsertProps) => {
  return <ConnectionFlowComponent params={params} />;
};

DataflowEditPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default DataflowEditPageLayout;
