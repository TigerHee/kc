import styled from 'emotion/index';
import { variant } from 'styled-system';

export const AlertRoot = styled.mark`
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  border-radius: ${(props) => props.theme.radius.middle};
  font-family: ${(props) => props.theme.fonts.family};
  font-weight: 400;
  ${(props) => {
    return variant({
      prop: 'type',
      variants: {
        success: {
          background: props.theme.colors.primary8,
        },
        error: {
          background: props.theme.colors.secondary8,
        },
        warning: {
          background: props.theme.colors.complementary8,
        },
        info: {
          background: props.theme.colors.cover4,
        },
      },
    });
  }}
  ${props => props.theme.breakpoints.down('sm')} {
    padding: 12px;
  }
`;

export const AlertContent = styled.div`
  flex: 1;
`;

export const AlertTitle = styled.p`
  font-family: ${(props) => props.theme.fonts.family};
  ${(props) => {
    return variant({
      prop: 'type',
      variants: {
        success: {
          color: props.theme.colors.primary,
        },
        error: {
          color: props.theme.colors.secondary,
        },
        warning: {
          color: props.theme.colors.text60,
        },
        info: {
          color: props.theme.colors.text60,
        },
      },
    });
  }}
  font-size: 14px;
  margin: 0;
  line-height: 130%;
`;

export const AlertDescription = styled.p`
  margin: 4px 0 0 0;
  font-family: ${(props) => props.theme.fonts.family};
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  line-height: 130%;
`;

export const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  flex-shrink: 0;
  padding-top: 1px;
`;

export const AlertAction = styled.div`
  display: inline-flex;
  align-items: flex-start;
  flex-shrink: 0;
  padding: 0 0 0 16px;
  cursor: pointer;
  line-height: 26px;
  font-family: ${(props) => props.theme.fonts.family};
  color: ${(props) => props.theme.colors.textPrimary};
`;
