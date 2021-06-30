// https://next.keystonejs.com/docs/apis/fields
import { integer, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Product = list({
  // TODO: Add Access Control - https://next.keystonejs.com/docs/apis/access-control

  // * Fields Option - https://next.keystonejs.com/docs/apis/schema#fields
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',

      // * UI Option Control - https://next.keystonejs.com/docs/apis/schema#ui
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer(),
    // TODO: Add Photos with Relationship
  },
});
