import { ListAccessArgs } from './types';

// ? Access Control return a Yes or No Value depending on users Session
export function isSignedIn({ session }: ListAccessArgs) {
  // ? !! convert/coerce falsy (https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or truthy to Boolean
  return !!session;
}
