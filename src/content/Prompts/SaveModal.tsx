import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
      <Dialog
        open={openModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          }
        }}
      >
        <Paper sx={{ minWidth: '400px' }}>
          <DialogTitle>{Title}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DialogContentText>{Description}</DialogContentText>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleSaveExplore}>
              Save
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
}
