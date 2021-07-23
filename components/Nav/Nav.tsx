import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useColorMode,
  Stack,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { UserAuthType } from 'next-auth';
import { signout } from 'next-auth/client';
import { IoMoon, IoSunny } from 'react-icons/io5';

import MovieModal from '../MovieModal';
import ReviewModal from '../ReviewModal';
import StorageModal from '../StorageModal';

interface NavProps {
  user: UserAuthType;
  showMovies: boolean;
  showReview: boolean;
}

export const Nav: React.FC<NavProps> = ({ user, showMovies, showReview }): React.ReactElement => {
  const links = [
    { link: `/`, name: `Home` },
    { link: `/user/${user?.sub}`, name: `My Reviews` },
    { link: `/users`, name: `All Users`, adminOnly: true },
  ];
  const { colorMode, toggleColorMode } = useColorMode();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const shortSiteName = process.env.NEXT_PUBLIC_SHORT_SITE_NAME;
  return (
    <Fragment>
      <Box
        width="100vw"
        borderTop={'5px solid'}
        borderColor={useColorModeValue('purple.500', 'purple.300')}
      >
        <Flex
          h={20}
          maxWidth="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={8} alignItems="center" ml={5}>
            <Link href="/">
              <a>
                <Heading fontSize="2xl">
                  {useBreakpointValue({
                    base: shortSiteName || 'SMDB',
                    md: siteName || 'ScuffedMDB',
                  })}
                </Heading>
              </a>
            </Link>
          </HStack>

          <Stack align="center" direction="row" spacing={3} mx={4}>
            <IconButton
              variant="ghost"
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              icon={
                colorMode === `light` ? (
                  <IoMoon size={18} />
                ) : (
                  <IoSunny size={18} />
                )
              }
            />

            <Stack isInline>
              {user.isReviewer && showReview && (
                <ReviewModal isAdmin={user.isAdmin} inNav />
              )}
              {user.isAdmin && showMovies && <MovieModal />}
              <StorageModal />
            </Stack>

            <Menu>
              <MenuButton
                mr={5}
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
              >
                <Avatar size="sm" boxShadow="none" src={user.image} />
              </MenuButton>
              <MenuList zIndex={999}>
                {links.map((link, i) => {
                  if (link.adminOnly && !user.isAdmin) {
                    return null;
                  }
                  return (
                    <Link href={link.link} key={i.toString()} passHref>
                      <MenuItem>{link.name}</MenuItem>
                    </Link>
                  );
                })}
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    signout();
                  }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Box>
    </Fragment>
  );
};
