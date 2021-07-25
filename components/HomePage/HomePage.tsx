import { NextSeo } from 'next-seo';
import { UserAuthType } from 'next-auth';
import { Fragment, useEffect } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';

import CardGrid from '../CardGrid';
import AppLayout from '../AppLayout';
import { PopulatedUserType } from '../../models/user';
import { ReviewType, SerializedMovieType } from '../../models/movie';

interface HomePageProps {
  user: UserAuthType;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

export const HomePage: React.FC<HomePageProps> = ({ user, movies }): React.ReactElement => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`test`, {
      variant: `subtle`,
      position: `top`,
      title: `Read only mode`,
      description: `You do not have permissions to add or remove reviews.`,
      status: `error`,
      isClosable: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);
  useEffect(() => {
    if (!user.isAdmin && !user.isReviewer) {
      toast({
        id: `test`,
        variant: `subtle`,
        position: `top`,
        title: `Read only mode`,
        description: `You do not have permissions to add or remove reviews.`,
        status: `error`,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <NextSeo title="Home" />
      <AppLayout user={user} showMovies>
        <div>
          <CardGrid movies={movies} user={user} />
        </div>
      </AppLayout>
    </Fragment>
  );
};
