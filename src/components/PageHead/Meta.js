/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import constants from '@constants/index';

const propTypes = {};

const defaultProps = {};

const Meta = (props) => {
  const { metadata } = constants;
  return (
    <>
      <meta name="description" content={metadata.APP_DESCRIPTION} />
      <meta content={metadata.KEY_WORDS} name="keywords" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:site"
        content={'@' + metadata.APP_NAME.toLowerCase()}
      />
      <meta name="twitter:title" content={metadata.APP_NAME} />
      <meta name="twitter:description" content={metadata.APP_DESCRIPTION} />
      <meta name="twitter:image" content={metadata.IMG_SHARE} />
      {/* Facebook */}
      <meta property="fb:app_id" content={metadata.FB_APP_ID} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metadata.APP_NAME} />
      <meta property="og:description" content={metadata.APP_DESCRIPTION} />
      <meta property="og:image" content={metadata.IMG_SHARE} />
      <meta property="og:image:width" content="200" />
      <meta property="og:image:height" content="200" />
      <meta property="og:locale" content="en_EN" />
      <meta property="og:url" content={metadata.WEB_URL} />
    </>
  );
};

Meta.propTypes = propTypes;

Meta.defaultProps = defaultProps;

export default Meta;
