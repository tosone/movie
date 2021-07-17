import { mode, transparentize } from '@chakra-ui/theme-tools';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  variants: {
    IMDB: (props: any) => ({
      color: '#F5C518',
      bg: 'transparent',
      _hover: {
        bg: mode(
          transparentize(`#F5C518`, 0.25)(props.theme),
          transparentize(`#F5C518`, 0.12)(props.theme)
        )(props),
      },
    }),
  },
};