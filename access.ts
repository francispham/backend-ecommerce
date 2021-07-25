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
