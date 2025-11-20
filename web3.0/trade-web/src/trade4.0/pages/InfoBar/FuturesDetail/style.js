/**
 * Owner: clyne@kupotech.com
 */
import { fx, styled, colors } from '@/style/emotion';
import dropStyle from '@/components/DropdownSelect/style';

export const FuturesDetailWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-flow: wrap;
  }
  ${(props) => {
    const { isMore } = props;
    if (isMore) {
      return `
        display: block;
      `;
    }
  }}
  .text-tips {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    margin-left: 24px;
    white-space: nowrap;

    ${(props) => fx.color(props, 'text')}

    ${(props) => {
      const { isMore } = props;
      if (isMore) {
        return `
          display: flex;
          margin-left: 0;
          justify-content: space-between;
          align-items: center;
          .text-value {
            margin-left: 24px;
          }
        `;
      }
    }}
    .header-box {
      display: flex;
      ${fx.alignItems('center')}
      ${(props) => fx.color(props, 'text40')}
      margin-bottom: 2px;
    }

    .text-header {
      display: inline-block;
      ${(props) => fx.color(props, 'text40')}
      border-bottom: 1px dashed ${(props) => colors(props, 'text40')};
      ${fx.cursor('help')}
      line-height: 16px;
    }
    .noTips.text-header {
      border-bottom: none;
      ${fx.cursor('text')}
    }

    .text-color {
      ${(props) => fx.color(props, 'text')}
    }
    .gold {
      ${(props) => fx.color(props, 'complementary')}
    }
  }
  .title {
    font-size: 12px;
    line-height: 14px;
    white-space: normal;
    ${(props) => fx.color(props, 'disabled')}
  }
  .settle {
    display: flex;
    ${fx.alignItems('center')}
  }
  .line {
    ${(props) => fx.color(props, 'text40')}
    padding: 0 2px;
  }
`;

export const MoreText = styled.div`
  position: absolute;
  display: flex;
  left: -60px;
  top: 16px;
`;

export const MoreWrapper = styled.div`
  display: flex;
  ${fx.alignItems('center')}
  ${fx.justifyContent('center')}
  ${(props) => fx.color(props, 'icon')}
  padding-left: 16px;
  svg {
    display: block;
  }
`;

export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    padding: 0;
  `,

  List: styled(dropStyle.List)`
    .dropdown-item {
      font-size: 12px;
      padding: 12px;
    }
  `,
};
