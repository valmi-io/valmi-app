/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Storage from './storage';

class CookieSettingsStorage extends Storage {
  get accepted() {
    return !!this.value && !!this.value.accepted;
  }

  set accepted(val) {
    this.value = { ...this.value, accepted: val };
  }
}

const CookieSettingsStorage = new CookieSettingsStorage('COOKIE_SETTINGS', {
  accepted: false
});

export default CookieSettingsStorage;
