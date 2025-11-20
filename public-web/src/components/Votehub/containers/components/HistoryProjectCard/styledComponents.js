/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledCard = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  // background: ${(props) => props.theme.colors.overlay};
  // 黑色写死 #171717 白色写死#ffffff  非组件库对应值
  background: ${(props) => (props.theme.currentTheme === 'light' ? '#ffffff' : '#171717')};
  border: ${(props) => `1px solid ${props.theme.colors.divider8}`};

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 24px;
  }

  .symbolInfoWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .symbolInfo {
      margin-bottom: 0;
      .logo {
        border: ${(props) => `2px solid ${props.theme.colors.complementary}`};
        border-radius: 52px;
      }
    }

    .hotWrapper {
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
    }
  }
`;

export const ActiveTitle = styled.div`
  margin-bottom: 24px;
  display: flex;

  .title {
    display: -webkit-box;
    overflow: hidden;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .title {
      font-size: 18px;
    }
  }
`;

export const SymbolInfoHot = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  // line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  img {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    font-weight: 600;
    font-size: 18px;
    img {
      width: 24px;
      height: 24px;
    }
  }
`;
export const SymbolInfoButton = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;

  .date {
    margin-right: 16px;
    // margin-bottom: 24px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }

  button {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .date {
      margin-bottom: 0;
      font-size: 18px;
    }

    button {
      width: 162px;
      margin-top: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .date {
      display: inline-flex;
      align-items: center;
      height: 40px;
    }
  }
`;
