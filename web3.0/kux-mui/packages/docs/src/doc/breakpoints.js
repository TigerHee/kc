/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useTheme, useMediaQuery } from '@kux/mui';
/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import Wrapper from './wrapper';

const useStyle = ({ breakpoints }) => {
  return {
    box: css`
      width: 400px;
      height: 200px;
      background: blue;
      ${breakpoints.up('sm')} {
        background: blueviolet;
      }
      // 此为自定义断点，基础断点无该值
      ${breakpoints.up('md')} {
        background: red;
      }
      ${breakpoints.up('lg')} {
        background: yellowgreen;
      }
      ${breakpoints.up('xl')} {
        background: #000;
      }
    `,
  };
};

const Text = styled.div(({ breakpoints }) => ({
  width: '100%',
  height: '100%',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 20,
  boxSizing: 'border-box',
  [breakpoints.up('sm')]: {
    justifyContent: 'flex-start',
  },
  [breakpoints.up('md')]: {
    justifyContent: 'center',
  },
  [breakpoints.up('lg')]: {
    justifyContent: 'flex-end',
  },
}));

function Box() {
  const theme = useTheme();
  const { breakpoints } = theme;

  const classes = useStyle({ breakpoints });
  const xs = useMediaQuery((theme) => breakpoints.up('xs'));
  const upSm = useMediaQuery((theme) => breakpoints.up('sm'));
  const upLg = useMediaQuery((theme) => breakpoints.up('lg'));
  const upXl = useMediaQuery((theme) => breakpoints.up('xl'));

  const isMatched = useMediaQuery('(min-width:600px)');

  return (
    <div css={classes.box}>
      <Text breakpoints={breakpoints}>
        <div>breakpoints.up('xs'): {JSON.stringify(xs)}</div>
        <div>breakpoints.up('sm'): {JSON.stringify(upSm)}</div>
        <div>breakpoints.up('lg'): {JSON.stringify(upLg)}</div>
        <div>breakpoints.up('xl'): {JSON.stringify(upXl)}</div>
        <div>【 in condition min-width: 600px 】：{JSON.stringify(isMatched)}</div>
      </Text>
    </div>
  );
}

export default () => {
  return (
    <Wrapper>
      <Box />
    </Wrapper>
  );
};
