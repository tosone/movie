// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

import { SerializedUser } from './../models/user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */

  interface User extends SerializedUser {
    name: string;
    email: string;
    image: string;
    sub: string;
    iat: number;
    exp: number;
  }

  type UserAuthType = User;
  interface Session {
    user: User;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
}
