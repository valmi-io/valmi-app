// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 7th 2023, 3:01:16 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';
import { loadCSS } from 'fg-loadcss';
import Icon from '@mui/material/Icon';

type FontAwesomeIconProps = {
  className: string;
  style?: object;
};

const FontAwesomeIcon = (props: FontAwesomeIconProps) => {
  const { className, style } = props;

  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v6.4.0/css/all.css',
      // Inject before JSS
      document.querySelector('#font-awesome-css') || document.head.firstChild
    );

    return () => {
      node.parentNode!.removeChild(node);
    };
  }, []);

  return (
    <Icon
      className={className}
      sx={{
        boxSizing: 'content-box',
        fontSize: '1rem',
        ...style
      }}
    />
  );
};

export default FontAwesomeIcon;
