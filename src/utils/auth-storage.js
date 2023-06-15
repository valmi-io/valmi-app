/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Storage from './storage';

class AuthStorage extends Storage {
  get loggedIn() {
    return !!this.value && !!this.value.token;
  }

  get token() {
    return this.value && this.value.token;
  }

  get userId() {
    return this.value && this.value.userId;
  }

  get role() {
    return this.value && this.value.role;
  }
}

const authStorage = new AuthStorage('AUTH');

export default authStorage;
