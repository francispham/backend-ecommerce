import { list } from '@keystone-next/keystone/schema';

// https://next.keystonejs.com/docs/apis/fields
import { text, password, relationship } from '@keystone-next/fields';

import { isSignedIn, rules, permissions } from '../access';

// * Docs: https://next.keystonejs.com/docs/apis/config#lists
export const User = list({
  access: {
    create: isSignedIn,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // ? Only User with Permission can delete themselves!
    delete: permissions.canManageUsers,
  },
  ui: {
    // Hide the BE UI from Regular Users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
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
      },
    }),
    orders: relationship({ ref: 'Order.user', many: true }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
    products: relationship({ ref: 'Product.user', many: true }),
  },
});
