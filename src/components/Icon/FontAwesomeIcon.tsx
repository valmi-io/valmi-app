/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 7th 2023, 3:01:16 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';

type FontAwesomeIconProps = {
  icon: any;
  style?: React.CSSProperties;
};

const FontAwesomeIcon = (props: FontAwesomeIconProps) => {
  const { icon, style } = props;

  return (
    <FAIcon
      icon={icon}
      style={{
        boxSizing: 'content-box',
        fontSize: '1rem',
        ...style
      }}
    />
  );
};

export default FontAwesomeIcon;
