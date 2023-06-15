/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 12:28:20 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Typography, styled } from '@mui/material';
import Image from 'next/image';

export enum ImageSize {
  small = '20',
  medium = '32',
  large = '48',
  logo = '200'
}

export interface ImageComponentProps {
  src: string;
  size: ImageSize;
  alt?: string;
  title?: string;
  style?: object;
}

const BoxLayout = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center'
}));

const ImageComponent = (props: ImageComponentProps) => {
  const { src, alt, title, style, size } = props;

  const getTypographyVariant = (imageSize: ImageSize) => {
    if (ImageSize.small === imageSize) return 'body2';
    if (ImageSize.medium === imageSize) return 'body1';
    return 'h4';
  };

  return (
    <BoxLayout>
      <Image
        priority={true}
        src={src}
        alt={alt ? alt : 'icon'}
        width={size === ImageSize.logo ? 250 : size}
        height={size === ImageSize.logo ? 150 : size}
        style={style}
      />
      {title && (
        <Typography
          variant={getTypographyVariant(size)}
          color="text.primary"
          noWrap
        >
          {title}
        </Typography>
      )}
    </BoxLayout>
  );
};

export default ImageComponent;
