import { css } from '@kux/mui';
import ArrowDownIcon from '../static/ic2_arrow_down.svg';

export const useCommonStyles = ({ theme }) => {
  return {
    newFooterLinkGroup: css({
      width: '20%',
      paddingRight: 24,
      marginBottom: 56,
      minWidth: 240,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        paddingRight: 0,
        marginRight: 0,
        marginBottom: 28,
        '&:last-child': {
          marginRight: 'auto',
          width: '100%',
        },
        '&.ukLastGroup, &:not(:last-child)': {
          '.newFooterLinkGroupTitle': {
            position: 'relative',
            cursor: 'pointer',
            '& ~ a, & ~ div': {
              display: 'none',
            },
          },
        },
      },
      '.after': {
        paddingBottom: 12,
        '&::after': {
          position: 'absolute',
          top: 0,
          right: 0,
          content: `' '`,
          width: 16,
          height: 16,
          backgroundImage: `url(${ArrowDownIcon})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          transition: 'all 0.3s ease-in-out',
          transform: 'rotate(180deg)',
          '[dir="rtl"] &': {
            right: 'unset',
            left: 0,
          },
          [theme.breakpoints.up('sm')]: {
            display: 'none',
          },
        },
      },
      '&.newFooterLinkGroupMinW300': {
        minWidth: '300px',
      },
      '&.newFooterLinkMarginBottom48': {
        marginBottom: '48px',
        [theme.breakpoints.up('sm')]: {
          marginBottom: '24px',
        },
      },
    }),
    newFooterLinkGroupTitle: css({
      fontSize: 18,
      marginBottom: 20,
      fontWeight: 500,
      color: theme.colors.text,
      lineHeight: '130%',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        marginBottom: 0,
        '&::after': {
          position: 'absolute',
          top: 0,
          right: 0,
          content: `' '`,
          width: 16,
          height: 16,
          backgroundImage: `url(${ArrowDownIcon})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          transition: 'all 0.3s ease-in-out',
          '[dir="rtl"] &': {
            right: 'unset',
            left: 0,
          },
        },
      },
    }),
    newFooterHover: css({
      position: 'relative',
      width: 240,
      padding: '4px 0',
      wordBreak: 'break-all',
      display: 'block',
      fontSize: 14,
      cursor: 'pointer',
      color: theme.colors.text60,
      '&:hover': {
        color: theme.colors.text,
        '.newFooterHoverMenu': {
          display: 'block',
        },
      },
    }),
    newFooterHoverMenu: css({
      display: 'none',
      position: 'absolute',
      top: 'unset !important',
      listStyle: 'none',
      bottom: '100%',
      left: 16,
      transform: 'translate3d(-50%, 0, 0)',
      backgroundColor: theme.colors.background,
      width: '240px',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&::after': {
        position: 'absolute',
        width: 0,
        height: 0,
        left: '50%',
        bottom: -6,
        border: '6px solid transparent',
        borderBottomWidth: 0,
        borderTop: '6px solid #fff',
        content: `' '`,
        transform: 'translate3d(-50%, 0, 0)',
      },
      'a': {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 40,
        color: theme.colors.text60,
        padding: '0 24px',
        cursor: 'pointer',
        '&:hover': {
          background: theme.colors.cover2,
          color: theme.colors.text,
        },
      },
      [theme.breakpoints.down('sm')]: {
        left: 120,
        '[dir="rtl"] &': {
          left: 'unset',
          right: 0,
          transform: 'translate3d(0, 0, 0)',
        },
      },
    }),
  };
};
