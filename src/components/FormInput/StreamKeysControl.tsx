//@ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 9th 2024, 5:44:33 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import CustomIcon from '@/components/Icon/CustomIcon';
import { ControlProps } from '@jsonforms/core';
import appIcons from '@/utils/icon-utils';

const generateKey = () => {
  const id = uuidv4();
  const buffer = Buffer.alloc(16);
  uuidv4({}, buffer);
  const plaintext = buffer.toString('hex');
  const hint = plaintext.substring(0, 3) + '*' + plaintext.substring(plaintext.length - 3);

  return { id, plaintext, hint };
};

const StreamKeysControl = (props: ControlProps) => {
  let { data, handleChange, path, label } = props;

  const [itemId, setItemId] = useState<string>('');

  const isEmpty = data.length === 0;

  const handleCopyToClipboard = (str: string, itemId: string) => {
    setItemId(itemId);
    navigator.clipboard.writeText(JSON.stringify(str));
  };

  return (
    <Paper style={{ margin: 4 }} variant="outlined">
      <Stack
        sx={{ px: 1.5, pt: 1 }}
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography style={{ whiteSpace: 'nowrap' }} variant={'body1'}>
          {label}
        </Typography>
        <IconButton
          onClick={() => {
            (data = [...data, generateKey()]), handleChange(path, data);
          }}
        >
          <CustomIcon icon={appIcons.ADD} />
        </IconButton>
      </Stack>
      {isEmpty && (
        <Stack style={{ padding: 20, alignItems: 'center' }}>
          <Typography sx={{ color: (theme) => theme.colors.alpha.black[50], whiteSpace: 'nowrap' }} variant="body2">
            Keys list is empty
          </Typography>
        </Stack>
      )}
      {data.map((item: any, index: number) => {
        const isLastItem = index === data.length - 1;
        const hideDivider = isLastItem || data.length === 1;

        let writeKey = '';
        if (item.plaintext) {
          writeKey = `${item.id}:${item.plaintext}:${item.hint}`;
        } else {
          writeKey = `${item.id}:*******${item.hint.slice(-1)}`;
        }

        return (
          <Stack key={item.id} style={{ display: 'flex' }} sx={{ p: 1, mt: 1.5 }}>
            <Stack
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <Chip style={{ display: 'flex', fontSize: 11, borderRadius: 5 }} color={'default'} label={writeKey} />
                {item.plaintext && (
                  <Tooltip title={itemId === item.id ? 'Copied' : 'Copy to clipboard'}>
                    <IconButton
                      sx={{ ml: 2 }}
                      onClick={() => {
                        handleCopyToClipboard(writeKey, item.id);
                      }}
                    >
                      <CustomIcon icon={appIcons.CLIPBOARD} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <IconButton
                sx={{ ml: 2 }}
                onClick={() => {
                  (data = data.filter((i: any) => i.id !== item.id)), handleChange(path, data);
                }}
              >
                <CustomIcon icon={appIcons.DELETE} />
              </IconButton>
            </Stack>
            {!hideDivider && <Divider sx={{ mt: 0.5 }} orientation="horizontal" />}
          </Stack>
        );
      })}
    </Paper>
  );
};

export default withJsonFormsControlProps(StreamKeysControl);
