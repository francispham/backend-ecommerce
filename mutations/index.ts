// https://keystonejs.com/docs/apis/config#extend-graphql-schema
import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';

import addToCart from './addToCart';

// ? Make a fake GraphQL tagged template literal - JUST FOR GRAPHQL TEXT HIGHLIGHTING!!!
const graphql = String.raw; //  * Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw

// * Docs: https://keystonejs.com/docs/guides/schema-extension
export const extendGraphqlSchema = graphQLSchemaExtension({
  // * Docs: https://keystonejs.com/docs/guides/custom-fields#db-field
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
    }
  `,
  // * Docs: https://keystonejs.com/docs/guides/custom-fields#output
  resolvers: {
    Mutation: {
      addToCart,
    },
  },
});
