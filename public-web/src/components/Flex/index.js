/**
 * Owner: mike@kupotech.com
 */
import styled from '@emotion/styled';
import React from 'react';

export const Div = styled.div`
  ${({ customColor, color, theme }) => {
    if (customColor || color) {
      return {
        color: customColor || theme.colors[color || 'text'],
      };
    }
  }}
  ${({ fs }) => {
    if (fs) {
      return {
        fontSize: `${fs}px`,
      };
    }
  }}
  ${({ mr }) => {
    if (mr) {
      return {
        marginRight: `${mr}px`,
      };
    }
  }}
  ${({ mb }) => {
    if (mb) {
      return {
        marginBottom: `${mb}px`,
      };
    }
  }}
  ${({ ml }) => {
    if (ml) {
      return {
        marginLeft: `${ml}px`,
      };
    }
  }}
    ${({ mt }) => {
    if (mt) {
      return {
        marginTop: `${mt}px`,
      };
    }
  }}
  ${({ pl }) => {
    if (pl) {
      return {
        paddingLeft: `${pl}px`,
      };
    }
  }}
  ${({ pr }) => {
    if (pr) {
      return {
        paddingRight: `${pr}px`,
      };
    }
  }}
  ${({ pt }) => {
    if (pt) {
      return {
        paddingTop: `${pt}px`,
      };
    }
  }}
  ${({ pb }) => {
    if (pb) {
      return {
        paddingBottom: `${pb}px`,
      };
    }
  }}
`;

const TextBase = styled(Div)`
  ${({ flex }) => {
    if (flex) {
      return {
        display: flex || 'flex',
      };
    }
  }}
  ${({ cursor }) => {
    if (cursor) {
      return {
        cursor: cursor !== true ? cursor : 'pointer',
      };
    }
  }}

  ${({ column }) => {
    if (column) {
      return {
        flexDirection: column,
      };
    }
  }}
  ${({ ft, fw }) => {
    if (ft || fw) {
      return {
        fontWeight: ft || fw,
      };
    }
  }}
  ${({ lh }) => {
    if (lh) {
      return {
        lineHeight: lh,
      };
    }
  }}
  ${({ vc }) => {
    if (vc) {
      return {
        alignItems: 'center',
      };
    }
  }}
  ${({ hc }) => {
    if (hc) {
      return {
        justifyContent: 'center',
      };
    }
  }}
  ${({ sb }) => {
    if (sb) {
      return {
        justifyContent: 'space-between',
      };
    }
  }}
  ${({ flexWrap }) => {
    if (flexWrap) {
      return {
        flexWrap: flexWrap !== true ? flexWrap : 'wrap',
      };
    }
  }}
  ${({ part }) => {
    if (part) {
      return {
        flex: part,
      };
    }
  }}
`;

export const Text = React.forwardRef((props, ref) => <TextBase ref={ref} as="span" {...props} />);

export const Flex = React.forwardRef((props, ref) => (
  <Text ref={ref} as="div" {...props} flex="flex" />
));
