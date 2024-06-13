import React, { ReactElement } from 'react';

import SidebarLayout from '@layouts/SidebarLayout';

import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';

import ConnectionFlowComponent from '@/content/ConnectionFlow/ConnectionFlowComponent';

type TConnectionUpsertParams = {
  type: string;
  wid: string;
  mode: 'etl' | 'retl';
  connectionId?: string;
};

export type TConnectionUpsertProps = {
  params: TConnectionUpsertParams;
  isEditableFlow?: boolean;
};

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
