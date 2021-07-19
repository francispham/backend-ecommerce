import { list } from '@keystone-next/keystone/schema';
// https://next.keystonejs.com/docs/apis/fields
import { text, password, relationship } from '@keystone-next/fields';

// https://next.keystonejs.com/docs/apis/config#lists
export const User = list({
  // TODO: Add Access Control - https://next.keystonejs.com/docs/apis/access-control
  // TODO: Add UI Option Control - https://next.keystonejs.com/docs/apis/schema#ui

  // * Fields Option - https://next.keystonejs.com/docs/apis/schema#fields
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        // TODO: Add Roles and Order
      },
    }),
  },
});
