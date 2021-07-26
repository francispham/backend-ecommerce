/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// ? Access Control return a Yes or No Value depending on users Session
export function isSignedIn({ session }: ListAccessArgs) {
  // ? !! convert/coerce falsy (https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or truthy to Boolean
  return !!session;
}
// * Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// ? Permissions Access Functions check if someone meets a Criteria - Yes or No
export const permissions = {
  ...generatedPermissions,
  // ? Adding Additional/Custom Permissions on top of the Default Ones!
  isFrancis({ session }: ListAccessArgs): boolean {
    return !!session?.data.name.includes('Francis');
  },
};

// ? Rule Based Functions - Return a Boolean or a Filter which Limits which Products can be CRUD.
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // ? For Correcting Error Message when user is not logged in
    if (!isSignedIn({ session })) return false;

    // ? 1. Check for the Permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // ? 2. if not, check if they are the Owner of the Product
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // ? 1. Check for the Permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // ? 2. if not, check if they are the Owner of the Product
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // ? 1. Check for the Permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // ? 2. if not, check if they are the Owner of the Order
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    if (permissions.canManageProducts({ session })) {
      return true; // ? Can Read Everything
    }

    // ? Only See the Available Products
    return { status: 'AVAILABLE' };
  },
};
