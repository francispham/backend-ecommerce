/* eslint-disable */
// https://keystonejs.com/docs/apis/context#context-api
import { KeystoneContext } from '@keystone-next/types';

import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

export default async function addToCart(
  root: any,  //  * Docs: https://graphql.org/learn/execution/#root-fields-resolvers
  { productId }: { productId: string },
  context: KeystoneContext
  ): Promise<CartItemCreateInput> {
  // ?  1. Query the Current User through Session if signed in
  // * Docs: https://keystonejs.com/docs/apis/context#session-api
  const currentSession = context.session as Session;
  if (!currentSession?.itemId) {
    throw new Error('Not signed in');
  }

  // ?  2. Query the Current User's Cart
  const allCartItems = await context.lists.CartItem.findMany({  //  * Docs: https://keystonejs.com/docs/apis/list-items#find-many
    where: { user: { id: currentSession.itemId }, product: { id: productId } }, //  ? will return a list of cart items from the current user with same productId
    resolveFields: 'id,quantity'
  });
  const [existingCartItem] = allCartItems;  //  ? Since we are only querying for one item, we can use the first item in the list!

  // ?  3. If the Product is already in the Cart, add the quantity
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, incremented by 1!`
    );
    return await context.lists.CartItem.updateOne({ //  * Docs: https://keystonejs.com/docs/apis/list-items#update-one
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,   //  * Docs: https://keystonejs.com/releases/2021-04-20
    });
  }
  // ?  4. If the Product is not in the Cart, add it
  return await context.lists.CartItem.createOne({ //  * Docs: https://keystonejs.com/docs/apis/list-items#create-one
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: currentSession.itemId } },
    },
    resolveFields: false,
  });
};
