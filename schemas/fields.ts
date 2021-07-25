// https://keystonejs.com/docs/apis/fields#checkbox
import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can Update and Delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can Query other Users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit other Users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD Roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can see and manage Cart and Cart Items',
  }),
  canManageOrders: checkbox({
    defaultValue: false,
    label: 'User can see and manage Orders',
  }),
};

// * Docs: https://stackoverflow.com/questions/55377365/what-does-keyof-typeof-mean-in-typescript
export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
