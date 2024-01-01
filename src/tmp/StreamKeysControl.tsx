// @ts-nocheck
import React from 'react';
import { faCheckCircle, faCrosshairs, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Button, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface StreamKeysControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const generateKey = () => {
  const id = uuidv4();
  const buffer = Buffer.alloc(16);
  uuidv4({}, buffer);
  const plaintext = buffer.toString('hex');
  const hint = plaintext.substring(0, 3) + '*' + plaintext.substring(plaintext.length - 3);

  console.log({ id, plaintext, hint });
  return { id, plaintext, hint };
};

const StreamKeysControl = ({ data, handleChange, path }: StreamKeysControlProps) => {
  // console.log('StreamKeysControl', data);
  // console.log('StreamKeysControl', handleChange);
  // console.log('StreamKeysControl', path);
  return (
    <>
      <IconButton
        onClick={() => {
          (data = [...data, generateKey()]), handleChange(path, data);
        }}
        color={'primary'}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </IconButton>

      {data.map((item: any, index: number) => (
        <React.Fragment key={item.id}>
          <li key={index}>{JSON.stringify(item)}</li>
          <IconButton
            onClick={() => {
              (data = data.filter((i: any) => i.id !== item.id)), handleChange(path, data);
            }}
            color={'error'}
          >
            <FontAwesomeIcon icon={faCrosshairs} />
          </IconButton>
        </React.Fragment>
      ))}
    </>
  );
};

export default withJsonFormsControlProps(StreamKeysControl);
