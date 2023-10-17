/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 1:42:54 pm
 * Author: Nagendra S @ valmi.io
 */

import { Stack, styled } from '@mui/material';

import FormFieldText from '@components/FormInput/FormFieldText';

const Layout = styled(Stack)(({ theme }) => ({
  ...theme.typography.body2
}));

const TemplatedFields = (props: any) => {
  const { mapping, mappingUpdated } = props;

  return (
    <Layout spacing={2}>
      {mapping.map((mapObj: any, index: any) => {
        return (
          <FormFieldText
            key={index}
            field={{}}
            description={mapObj.description}
            label={mapObj.label}
            fullWidth={true}
            type="text"
            required={mapObj.required}
            error={false}
            value={mapObj.value}
            onChange={(event: any) => {
              mappingUpdated(index, {
                ...mapObj,
                value: event.target.value
              });
            }}
          />
        );
      })}
    </Layout>
  );
};

export default TemplatedFields;
