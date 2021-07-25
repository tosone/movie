import Link from 'next/link';
import 'react-toggle/style.css';
import { NextSeo } from 'next-seo';
import { UserAuthType } from 'next-auth';
import { useState, useEffect } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  Container, SimpleGrid, Box, Flex, InputGroup, InputLeftElement,
  Input, Button, Heading, Menu, MenuButton, MenuItem, MenuList,
  chakra, useColorModeValue, useToast, useColorMode,
  Stack, IconButton, Tooltip, useBreakpoint,
} from '@chakra-ui/react';

import Card from '../Card';
import ReviewModal from '../ReviewModal';
import MovieGridView from '../MovieGridView';
import { PopulatedUserType } from '../../models/user';
import { BsCardImage, BsGrid3X3 } from 'react-icons/bs';
import { ReviewType, SerializedMovieType } from '../../models/movie';

interface CardGridProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  user: UserAuthType;
}

export const CardGrid: React.FC<CardGridProps> = ({ movies: unSortedMovies, user }): React.ReactElement => {
  const bp = useBreakpoint();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [cardView, setCardView] = useState(true);

  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`otherToast`, {
      variant: `subtle`,
      title: 'Movie not found',
      description: 'The shared movie does not exist',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [colorMode, toast]);

  const movies = {
    data: unSortedMovies
      ?.filter((mv) => {
        if (mv && mv.name.toLowerCase().includes(filter)) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (sort === 'recent' || sort === 'old') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sort === 'best') {
          return a.rating - b.rating;
        } else if (sort === 'worst') {
          return a.rating - b.rating;
        }
        return 0;
      }),
  };

  if (sort === 'best' || sort === 'recent') {
    movies.data = movies.data.reverse();
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';

  return (
    <>
      <NextSeo
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              width: 2542,
              height: 1312,
              url: `https://www.movie.michael-hall.me/sitePicture.png`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={'A private movie rating website'}
      />

      <Container maxW="container.xl" mt={10}>
        <Heading fontSize={{ base: '4xl', md: '6xl' }} textAlign="center">
          We have watched{' '}
          {
            <chakra.span color={useColorModeValue('purple.500', 'purple.300')}>
              {unSortedMovies?.length}
            </chakra.span>
          }{' '}
          movies
        </Heading>
        <Flex
          width="full"
          direction={{ base: 'column', md: 'row' }}
          my={7}
          justifyContent="space-between"
        >
          <Flex mb={{ base: 4, md: 0 }}>
            {(user.isReviewer || user.isAdmin) && (
              <ReviewModal isAdmin={user.isAdmin} />
            )}
          </Flex>

          <Stack direction={{ base: 'column', md: 'row' }}>
            <InputGroup maxWidth={{ base: 'full', md: '200px' }}>
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch color="gray.300" />
              </InputLeftElement>
              <Input
                variant="filled"
                type="text"
                placeholder="Search"
                onChange={(e) => setFilter(e.target.value.toLowerCase())}
              />
            </InputGroup>
            <Stack isInline alignItems="center">
              <Menu>
                <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                  Sort by...
                </MenuButton>
                <MenuList zIndex={998}>
                  <MenuItem zIndex={999} isDisabled={sort === 'recent'} onClick={() => setSort('recent')} >
                    Recent
                  </MenuItem>
                  <MenuItem zIndex={999} isDisabled={sort === 'old'} onClick={() => setSort('old')} >
                    Old
                  </MenuItem>
                  <MenuItem zIndex={999} isDisabled={sort === 'best'} onClick={() => setSort('best')} >
                    Best
                  </MenuItem>
                  <MenuItem zIndex={999} isDisabled={sort === 'worst'} onClick={() => setSort('worst')} >
                    Worst
                  </MenuItem>
                </MenuList>
              </Menu>
              {/* <Toggle
                icons={{ checked: <BsGrid3X3 />, unchecked: <BsGrid3X3 /> }}
              /> */}
              <Tooltip
                label="Toggle between card and table view"
                placement="top"
              >
                <Stack
                  isInline
                  bg={useColorModeValue('gray.100', 'whiteAlpha.200')}
                  height="full"
                  alignItems="center"
                  px={1}
                  borderRadius="md"
                >
                  <IconButton
                    bg={cardView ? 'purple.300' : 'transparent'}
                    size="sm"
                    onClick={() => setCardView(true)}
                    aria-label="Activate table mode"
                    colorScheme={cardView ? 'purple' : 'gray'}
                    icon={<BsCardImage />}
                  />
                  <IconButton
                    size="sm"
                    bg={!cardView ? 'purple.300' : 'transparent'}
                    onClick={() => setCardView(false)}
                    aria-label="Activate table mode"
                    colorScheme={!cardView ? 'purple' : 'gray'}
                    icon={<BsGrid3X3 />}
                  />
                </Stack>
              </Tooltip>
            </Stack>
          </Stack>
        </Flex>
        {cardView ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} alignItems="stretch" >
            {movies?.data?.map(
              (
                movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>,
                i
              ) => (
                <Link
                  key={`${i.toString()}cardBox`}
                  href={`/movie/${movie._id}`}
                  passHref
                >
                  <Box as={'a'} height="full">
                    <Card movie={movie} key={`${i.toString()}card`} />
                  </Box>
                </Link>
              )
            )}
          </SimpleGrid>
        ) : (
          <chakra.div
            overflowX={
              ['base', 'sm', 'md'].includes(bp || '') ? 'scroll' : 'hidden'
            }
            shadow="lg"
            maxW="full"
            borderRadius="xl"
            border="1px solid"
            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
          >
            <MovieGridView user={user} movies={movies.data} />
          </chakra.div>
        )}
      </Container>
    </>
  );
};
