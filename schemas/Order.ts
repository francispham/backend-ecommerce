import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    //  * Docs: https://keystonejs.com/docs/apis/fields#virtual-type
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        return `Total Earning: ${formatMoney(item?.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
