import { withJsonFormsControlProps } from '@jsonforms/react';

interface InvisibleControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const FormEmptyControl = ({ data, handleChange, path }: InvisibleControlProps) => {
  return null;
};

export default withJsonFormsControlProps(FormEmptyControl);
