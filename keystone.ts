// https://next.keystonejs.com/docs/apis/session
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';

// https://next.keystonejs.com/docs/apis/auth
import { createAuth } from '@keystone-next/auth';

// https://next.keystonejs.com/docs/apis/config#system-configuration-api
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import { insertSeedData } from './seed-data';

import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365, // ? How long should they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  // ? Required options
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',

  // ? Additional options
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial Roles here
  },
  // * Docs: https://keystonejs.com/docs/apis/auth#password-reset-link
  passwordResetLink: {
    // TODO: Fix TS Error
    async sendToken(args) {
      console.log('args:', args);
    },
  },
});

// https://next.keystonejs.com/docs/apis/config
export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    // https://keystonejs.com/docs/apis/config#db
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // * Added seed data:
      async onConnect(keystone) {
        console.log('keystone:', keystone);
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    // https://next.keystonejs.com/docs/apis/schema
    lists: createSchema({
      //  TODO: Add Schema items here:
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // ? Showed the UI only for people who pass this test
      isAccessAllowed: ({ session }) => {
        console.log('session:', session);
        // TODO: Fix TS Error
        return !!session?.data; // * Return a boolean!
      },
    },
    // * Added Session Values here:
    // ! Deprecated Method, check docs → https://next.keystonejs.com/docs/apis/session
    session: withItemData(statelessSessions(sessionConfig), {
      // ? GraphQL Query
      User: 'id',
    }),
  })
);
