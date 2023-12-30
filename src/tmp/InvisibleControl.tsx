import { withJsonFormsControlProps } from '@jsonforms/react';

interface InvisibleControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const InvisibleControl = ({ data, handleChange, path }: InvisibleControlProps) =>
{
    //console.log('InvisibleControl', data);
    return (
        <></>
    );
}

export default withJsonFormsControlProps(InvisibleControl);
