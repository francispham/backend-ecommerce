// https://keystonejs.com/docs/guides/relationships
import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

// https://keystonejs.com/docs/apis/fields#cloudinary-image
import { cloudinaryImage } from '@keystone-next/cloudinary';

import { isSignedIn, rules, permissions } from '../access';
import 'dotenv/config';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'ecommerce',
};

export const ProductImage = list({
  access: {
    create: isSignedIn,
    read: () => true,
    update: permissions.canManageProducts,
    delete: permissions.canManageProducts,
  },
  fields: {
    // https://keystonejs.com/docs/apis/fields#image
    image: cloudinaryImage({
      cloudinary,
      label: 'Source',
    }),
    altText: text(),
    product: relationship({ ref: 'Product.photo' }),
  },
  ui: {
    listView: {
      initialColumns: ['image', 'altText', 'product'],
    },
  },
});
