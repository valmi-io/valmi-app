/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';

import Meta from './Meta';
import constants from '../../constants';

const propTypes = {
  title: PropTypes.string.isRequired
};

const defaultProps = {
  title: ''
};

const PageHead = (props) => {
  const { title, ...attr } = props;

  return (
    <Head>
      <title>
        {(title ? title + ' | ' : '') + constants.metadata.APP_NAME}
      </title>
      <Meta {...attr} />
    </Head>
  );
};

PageHead.propTypes = propTypes;

PageHead.defaultProps = defaultProps;

export default PageHead;
