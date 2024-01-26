/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 7th 2023, 3:01:16 am
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type CustomIconProps = {
  icon: any;
  style?: React.CSSProperties;
};

const CustomIcon = (props: CustomIconProps) => {
  const { icon, style } = props;

  return (
    <FontAwesomeIcon
      icon={icon}
      style={{
        boxSizing: 'content-box',
        fontSize: '1rem',
        ...style
      }}
    />
  );
};

export default CustomIcon;
