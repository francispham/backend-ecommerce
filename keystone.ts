// https://next.keystonejs.com/docs/apis/config#system-configuration-api
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';

import { User } from './schemas/User';

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365, // How long should they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

// https://next.keystonejs.com/docs/apis/config
export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // TODO: Add data seeding here:
  },
  // https://next.keystonejs.com/docs/apis/schema
  lists: createSchema({
    //  TODO: Add Schema items here:
    User,
  }),
  ui: {
    //  TODO: Change this for Roles:
    isAccessAllowed: () => true,
  },
  //  TODO: Add Session Values here:
});
