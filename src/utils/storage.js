/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 25th 2023, 11:19:29 am
 * Author: Nagendra S @ valmi.io
 */

import cookie from 'react-cookies';

const mandatory = () => {
  throw new Error('Storage Missing parameter!');
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
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
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
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      ...this.#options
    });
    next();
  };
}
