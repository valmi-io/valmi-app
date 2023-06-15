/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({
    key: 'css'
  });
}
