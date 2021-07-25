import { text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

import { permissionFields } from './fields';

export const Role = list({
  fields: {
    name: text({ isRequired: true }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
/*
  * Authorization Includes:
  1. Permission
    - Checkboxes can someone do something or not
    - Checkboxes can see all Users or not
    - Checkboxes can edit Product or not
  2. Role
    Admin
      - manage Users
      - manage Products
    Editor
      - Read Products
      - NO Deletion
  3. Restricting Access
    - Access Permission Function - Yes or No
      eg. Can a User See all Products or not
    - Access Filter Functions - Query a Sub-Set of Data: { where: user: { id: ID } }
      eg. A User can only Edit Products that they Created
*/
