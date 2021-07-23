import React, { ReactNode, Fragment } from 'react';

import Nav from '../Nav';
import Footer from '../Footer';
import { UserAuthType } from 'next-auth';

interface AppLayoutProps {
  user: UserAuthType;
  children: ReactNode;
  showMovies?: boolean;
  showReview?: boolean;
}

export const AppLayout = ({ showMovies, showReview, user, children }: AppLayoutProps): React.ReactElement => (
  <Fragment>
    <Nav
      user={user}
      showMovies={showMovies || false}
      showReview={showReview || false}
    />
    {children}
    <Footer />
  </Fragment>
);
