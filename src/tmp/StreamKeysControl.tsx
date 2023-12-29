import { faCheckCircle, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Button, IconButton } from '@mui/material';

interface StreamKeysControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const StreamKeysControl = ({ data, handleChange, path }: StreamKeysControlProps) => {
  // console.log('StreamKeysControl', data);
  // console.log('StreamKeysControl', handleChange);
  // console.log('StreamKeysControl', path);
  return (
  <>
          <IconButton onClick={()=>{data = [...data, data.length], handleChange(path, data)}} color={'primary'}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </IconButton>

          {
            data.map((item: any, index: number) => (
              <li key={index}>{item}</li>
            ))
          }
  </>);
};

export default withJsonFormsControlProps(StreamKeysControl);
