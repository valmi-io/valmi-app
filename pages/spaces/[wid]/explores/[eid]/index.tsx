//@S-Nagendra
import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import { Card, Grid } from '@mui/material';

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IParams }) => {
  return (
    <PageLayout pageHeadTitle="Preview" title="Preview" displayButton={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ display: 'flex', height: 800 }}>
            <iframe
              src={
                'https://docs.google.com/spreadsheets/d/1Snsa-GXmxDtzV5D4Jd8OhXG5TxXigFeOJD2Q4XLiMOI/edit#gid=1115838130'
              }
              width="100%"
              height="100%"
              loading="lazy"
            ></iframe>
            {/* <GoogleDocumentViewer /> */}
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// const GoogleDocumentViewer = () => {
//   const [documentContent, setDocumentContent] = useState('');
//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         const response = await axios.get(
//           'https://docs.google.com/spreadsheets/d/13MHItdsg2cDElpZzZclNZKKFVuEpklDTkyRyt4unn4E/edit#gid=0',
//           {
//             headers: {
//               Authorization: `Bearer ya29.a0Ad52N390yh37zxNZayJSBzG-WryQGPZxXJdCs0RurDUf9HHhZzdzThE4N6UqiLoha9CY-TsCLmTAlHPoouYwZ8FW8fQ9Xn2zkr3vHdh4fwfCDk5Xd6HL5RnuvJ8vsGNCnaZ4Y-RuHtbcn-Mj2ene-LutH9R1yraAl_VFaCgYKAQoSARASFQHGX2Mi-VkhKIc-refTLYPP4DztHg0171`
//             }
//           }
//         );
//         console.log('response.data', response.data);
//         setDocumentContent(response.data);
//       } catch (error) {
//         console.error('Error fetching Google Document:', error);
//       }
//     };
//     fetchDocument();
//   }, []);
//   return (
//     <div>
//       <div dangerouslySetInnerHTML={{ __html: documentContent }} />
//     </div>
//   );
// };
