/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

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

const ConnectionCreatePageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <ConnectionCreatePage params={params} />;
};

const ConnectionCreatePage = ({ params }: TConnectionUpsertProps) => {
  return <ConnectionFlowComponent params={params} />;
};

ConnectionCreatePageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionCreatePageLayout;
