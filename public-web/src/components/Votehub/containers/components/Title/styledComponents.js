/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledTitle = styled.h2`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .title {
    display: inline-flex;
    align-items: center;
    img {
      display: none;

      ${(props) => props.theme.breakpoints.up('sm')} {
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 6px;
      }

      ${(props) => props.theme.breakpoints.up('lg')} {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 6px;
      }
    }
  }

  .extra {
    font-weight: 600;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    ${(props) => props.theme.breakpoints.up('sm')} {
      font-size: 14px;
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      font-size: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 32px;
    font-size: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 32px; // web 、中屏 32，H5 24
    font-size: 32px;
  }
`;
