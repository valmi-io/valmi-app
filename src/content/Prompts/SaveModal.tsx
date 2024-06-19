import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Paper, Dialog, DialogActions, DialogTitle, Stack } from '@mui/material';
import VButton from '@/components/VButton';

export default function SaveModal({
  Title,
  Description,
  exploreName,
  setExploreName,
  openModal,
  setOpenModal,
  handleSaveExplore
}: {
  Title: string;
  Description: string;
  exploreName: string;
  setExploreName: any;
  openModal: boolean;
  setOpenModal: any;
  handleSaveExplore: any;
}) {
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Dialog open={openModal} onClose={handleClose}>
        <Paper sx={{ minWidth: '400px' }}>
          <DialogTitle>{Title}</DialogTitle>

          <Stack sx={{ display: 'flex', px: 2, my: 2 }}>
            <TextField
              label={'Name of the explore'}
              required={true}
              value={exploreName}
              disabled={false}
              title={Title}
              onChange={(event) => setExploreName(event.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Stack>
          <DialogActions>
            <VButton
              buttonText={'CANCEL'}
              buttonType="submit"
              onClick={handleClose}
              size="small"
              disabled={false}
              variant="text"
            />
            <VButton
              buttonText={'SAVE'}
              buttonType="submit"
              onClick={handleSaveExplore}
              size="small"
              disabled={false}
              variant="text"
            />
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
}
