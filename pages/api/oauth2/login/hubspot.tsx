/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 3rd 2023, 5:27:00 pm
 * Author: Nagendra S @ valmi.io
 */

import passport from '@/lib/passport-hubspot';
import nextConnect from 'next-connect';

export default nextConnect()
  .use(passport.initialize())
  .get(
    passport.authenticate('hubspot', {
      scope: [
        'crm.objects.contacts.read',
        'crm.objects.contacts.write',
        'crm.objects.companies.read',
        'crm.objects.companies.write'
      ]
    })
  );
