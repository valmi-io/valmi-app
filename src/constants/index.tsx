/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

const constants = {
  urls: {
    API_URL: process.env.API_URL,
    WEB_URL: process.env.WEB_URL
  },
  metadata: {
    APP_NAME: 'valmi.io',
    APP_DESCRIPTION: 'valmi.io Open source Reverse-ETL',
    FB_APP_ID: '',
    IMG_SHARE: process.env.WEB_URL + '/icons/512x512.png',
    KEY_WORDS: '',
    WEB_URL: process.env.WEB_URL,
    PRIMARY_COLOR: 'red'
  },
  connections: {
    CONFIGURE_SOURCE: 'Configure source',
    SELECT_STREAMS: 'Select streams',
    CONFIGURE_CONNECTION: 'Configure connection',
    CONNECTIONS_TITLE: 'Connections',
    CREATE_CONNECTION_TITLE: 'Create connection',
    SELECT_CONNECTOR_TITLE: 'Select',
    CONFIGURE_CONNECTOR_TITLE: 'Configure connection',
    TEST_CONNECTOR_TITLE: 'Test',
    SELECT_CONNECTOR_LAYOUT_TITLE: 'Select connector'
  },
  catalog: {
    CREATE_CONNECTION_TITLE: 'CATALOG'
  },
  docs: {
    syncs: 'https://www.valmi.io/docs/concepts/syncs',
    tracks: 'https://www.valmi.io/docs/concepts/tracks'
  }
};

export default constants;
