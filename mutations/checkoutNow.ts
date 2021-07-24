import { KeystoneContext } from '@keystone-next/types';

import stripeConfig from '../lib/stripe';
import { Session } from '../types';
import {
  OrderCreateInput,
  CartItemCreateInput,
} from '../.keystone/schema-types';

interface Arguments {
  token: string;
}

const graphql = String.raw;

export default async function checkoutNow(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // ? Check if the User is logged in
  const { session } = context as { session: Session };
  const userId = session.itemId;
  if (!userId) {
    throw new Error('User not logged in');
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          id
          name
          price
          description
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }      
    `,
  });
  console.dir(user, { depth: null }); // ? `depth: null` ensures Unlimited Recursion

  // ? Calculate the total price for the User's Order
  const cartItems = user.cart.filter(
    (cartItem: CartItemCreateInput) => cartItem.product
  ); // ? Filter out existing products
  const amount = cartItems.reduce(
    (tally: number, cartItem: CartItemCreateInput) =>
      tally + cartItem.product.price * cartItem.quantity,
    0
  );
  console.log('amount:', amount);

  // ? Create the Payment with the Stripe API
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'usd',
      confirm: true,
      payment_method: token,
    })
    .catch((error) => {
      console.error('Error creating Payment Intent:', error);
      throw Error(error.message);
    });
  console.log('Charge:', charge);
  /* 
  TODO Steps:
  4. Convert the CartItems to OrderItems
  5. Create the Order and return it
  */
}
