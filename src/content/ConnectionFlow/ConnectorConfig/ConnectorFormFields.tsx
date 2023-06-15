/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Box from '@mui/material/Box';
import FormField from '../../../components/FormInput/FormField';
import { FormObject } from '../../../utils/form-utils';

interface ConnectorFormFieldsProps {
  fields: FormObject[];
  onSubmit: (formData: any) => void;
  selectedConnector: string;
  selected_file: string;
  hasAuthorizedOAuth?: boolean;
  oauth_error: string;
  fileInputRef?: React.Ref<HTMLInputElement>;
  handleUploadButtonClick: () => void;
  handleFileChange: (data: any) => void;
  handleOAuthButtonClick: (data: any) => void;
  control: any;
  handleSubmit: any;
}

const ConnectorFormFields = ({
  fields,
  selected_file,
  selectedConnector,
  hasAuthorizedOAuth,
  oauth_error,
  handleOAuthButtonClick,
  fileInputRef,
  handleUploadButtonClick,
  handleFileChange,
  onSubmit,
  control,
  handleSubmit
}: ConnectorFormFieldsProps) => {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': {
          m: 1,
          width: '100%'
        }
      }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {fields.map((field: FormObject) => {
        return (
          <FormField
            key={field.label}
            {...field}
            control={control}
            selectedConnector={selectedConnector}
            selected_file={selected_file}
            hasAuthorizedOAuth={hasAuthorizedOAuth}
            fileInputRef={fileInputRef}
            handleUploadButtonClick={handleUploadButtonClick}
            handleFileChange={handleFileChange}
            oauth_error={oauth_error}
            onClick={handleOAuthButtonClick}
          />
        );
      })}
    </Box>
  );
};

export default ConnectorFormFields;
