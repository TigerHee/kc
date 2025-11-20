/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import isPropValid from '@emotion/is-prop-valid';
import MDivider from '@kux/mui/Divider';

const shouldForwardProp = (prop) => isPropValid(prop) && prop !== 'color';
export const Div = styled('div', { shouldForwardProp })`
  ${({ color, theme }) => {
    if (color) {
      return {
        color: theme.colors[color || 'text'],
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
  ${({ fe }) => {
    if (fe) {
      return {
        justifyContent: 'flex-end',
      };
    }
  }}
  ${({ v }) => {
    if (v) {
      return {
        flexDirection: 'column',
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
  ${({ ve }) => {
    if (ve) {
      return {
        alignItems: 'flex-end',
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
export const Text = React.forwardRef((props, ref) =>
  <TextBase ref={ref} as="span" {...props} {...(props.color === 'text60' && { 'data-value': 'default' })} />);
export const Flex = React.forwardRef((props, ref) => (
  <Text ref={ref} as="div" {...props} flex="flex" />
));

export const DashText = styled(Text)`
  color: ${({ theme }) => theme.colors.text60};
  text-decoration: underline dashed ${({ theme }) => theme.colors.text20};
  text-underline-offset: 2px;
  cursor: pointer;
`;

export const Divider = styled(MDivider)`
  ${({ type }) => {
    if (type !== 'vertical') {
      return `margin-top: 16px;
              margin-bottom: 16px;`;
    }
  }}
  background-color: ${({ theme }) => theme.colors.divider4};
`;
