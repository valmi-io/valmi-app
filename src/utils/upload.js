/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import cookie from 'react-cookies';

const mandatory = () => {
  throw new Error('Storage Missing parameter!');
};

const configs = {
  path: '/',
  maxAge: 30 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
  // domain: '.allsubdomains.com',
  sameSite: 'strict'
};

export default class Storage {
  #name;

  #options = {};

  constructor(name = mandatory(), value = {}, options = {}) {
    this.#name = name;
    this.#options = options;

    if (!this.value) {
      this.value = value;
    }
  }

  set value(value) {
    cookie.save(this.#name, value, {
      ...configs,
      ...this.#options
    });
  }

  get value() {
    return cookie.load(this.#name);
  }

  // eslint-disable-next-line class-methods-use-this
  get allCookies() {
    return cookie.loadAll();
  }

  destroy = (next = (f) => f) => {
    cookie.remove(this.#name, {
      ...configs,
      ...this.#options
    });
    next();
  };
}
