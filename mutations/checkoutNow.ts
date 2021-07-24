import { KeystoneContext } from '@keystone-next/types';

import { OrderCreateInput } from '../.keystone/schema-types';

interface Arguments {
  token: string;
}

export default async function checkoutNow(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  /* 
  TODO Steps:
  1. Check if the User is logged in
  2. Calculate the total price for the User's Order
  3. Create the Payment with the Stripe API
  4. Convert the CartItems to OrderItems
  5. Create the Order and return it
  */
}
