/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, December 22nd 2023, 7:41:22 pm
 * Author: Nagendra S @ valmi.io
 */

import { Button, CircularProgress, useTheme } from '@mui/material';

type TSyncRunLogProps = {
  fetch: boolean;
  isFetching: boolean;
  onClick: () => void;
};

/**
 * Responsible for rendering `syncRunLogFooter`
 *
 * @param fetch
 * @param isFetching
 * @param onClick
 *
 * @returns
 */

const SyncRunLogFooter = ({ fetch, isFetching, onClick }: TSyncRunLogProps) => {
  const theme = useTheme();
  let startIcon;
  let buttonTitle = 'Load more';
  let backgroundColor;
  startIcon = fetch && isFetching && (
    <CircularProgress size={16} sx={{ color: 'white' }} />
  );

  if (isFetching) {
    buttonTitle = 'Loading newer logs';
    backgroundColor = theme.colors.info.main;
  }

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10
      }}
    >
      <Button variant="contained" startIcon={startIcon} onClick={onClick}>
        {buttonTitle}
      </Button>
    </div>
  );
};

export default SyncRunLogFooter;
