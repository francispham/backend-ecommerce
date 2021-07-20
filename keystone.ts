// https://next.keystonejs.com/docs/apis/session
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';

// https://next.keystonejs.com/docs/apis/auth
import { createAuth } from '@keystone-next/auth';

// https://keystonejs.com/docs/apis/schema
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';

import { Session } from './types';
import { insertSeedData } from './seed-data';
import { extendGraphqlSchema } from './mutations';
import { sendPasswordResetEmail } from './lib/mail';

import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { Product } from './schemas/Product';
import { User } from './schemas/User';

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365, // ? How long should they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

//  * Docs: https://keystonejs.com/docs/apis/auth#authentication-api
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
    async sendToken(args) {
      // ? Send a token to the user's email address
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  //  * Docs: https://keystonejs.com/docs/apis/config#system-configuration-api
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    //  * Docs: https://keystonejs.com/docs/apis/config#db
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // * Added seed data:
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    //  * https://keystonejs.com/docs/apis/config#lists
    lists: createSchema({
      //  TODO: Add Schema items here:
      User,
      Product,
      ProductImage,
      CartItem,
    }),
    //  * Docs: // https://keystonejs.com/docs/apis/config#extend-graphql-schema
    extendGraphqlSchema,
    // * Docs: https://keystonejs.com/docs/apis/config#ui
    ui: {
      // ? Showed the UI only for people who pass this test
      isAccessAllowed: ({ session }): boolean => {
        const currentSession = session as Session;
        return !!currentSession?.data;
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
