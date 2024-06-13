/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 12th 2024, 4:02:27 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement } from 'react';

import SidebarLayout from '@layouts/SidebarLayout';

import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';

import ConnectionFormComponent from '@/content/ConnectionFlow/ConnectionFlowComponent';

type TConnectionUpsertParams = {
  type: string;
  wid: string;
  mode: 'etl' | 'retl';
  connectionId?: string;
};

export type TConnectionUpsertProps = {
  params: TConnectionUpsertParams;
};

const ConnectionEditPageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <ConnectionEditPage params={params} />;
};

const ConnectionEditPage = ({ params }: TConnectionUpsertProps) => {
  return <ConnectionFormComponent params={params} />;
};

ConnectionEditPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionEditPageLayout;
