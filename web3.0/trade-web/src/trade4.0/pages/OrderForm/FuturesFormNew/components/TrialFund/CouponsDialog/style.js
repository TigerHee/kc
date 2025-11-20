/**
 * Owner: garuda@kupotech.com
 */

import { styled } from '../../../builtinCommon';

export const CouponsWrapper = styled.div`
  position: relative;
`;

export const CouponsBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
`;

export const CouponsTitle = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
`;

export const CouponsAmount = styled.div`
  position: absolute;
  top: 50%;
  left: 44px;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 76px;
  &.VIP {
    color: ${(props) => props.theme.colors.complementary};
  }
  &.NORMAL {
    color: ${(props) => props.theme.colors.primary};
  }
  &.COUPON {
    color: #7780df;
  }
  .amount {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
  }
  .unit {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    white-space: normal;
    word-break: break-word;
  }
`;

export const CouponsLeft = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  // box-shadow: 8px 2px 12px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px 0 0 8px;
  // background-color: rgba(0, 0, 0, 0.05);
  &::after {
    content: ' ';
    position: absolute;
    width: 16px;
    height: 16px;
    top: -8px;
    right: 0;
    z-index: 1;
    background-color: ${(props) => (props.isLight ? '#FFF' : 'transparent')};
    border-bottom: 1px solid ${(props) => (props.isLight ? 'whitesmoke' : 'transparent')};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &::before {
    content: ' ';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    bottom: -8px;
    //FIXME: background 下 linear-gradient 会被 rtl 转换，换成 background-image
    background-image: ${(props) =>
      (props.isLight
        ? 'linear-gradient(180deg, #f3f3f3 0%, whitesmoke 60%, transparent 60%, transparent 100%)'
        : 'transparent')};
    border-top: none;
    z-index: 1;
    right: 0;
  }
  .cardLeftImage {
    transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'scaleX(1)')};
  }
  .cardIcon {
    position: absolute;
    top: 0;
    right: 2px;
    left: 2px;
    color: ${(props) => (props.isNormal ? '#01BC8D' : '#6971C8')};
  }
`;

export const CouponsRight = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 166px;
  padding: 16px;
  border-radius: 0 8px 8px 0;
  background: ${(props) => (props.isLight ? '#FFF' : '#29292A')};
  //FIXME: box-shadow 在 rtl 场景下第一个值是负数会被 rtl 插件转成正数
  box-shadow: ${(props) => {
    return props.isRtl
      ? `0px 0px 0px 0px rgba(0,0,0,0), -12px -10px 12px -4px rgba(0, 0, 0, 0.02), -12px 10px 16px -4px rgba(0, 0, 0, 0.03)`
      : '12px -10px 12px -4px rgba(0, 0, 0, 0.02), 12px 16px 10px -4px rgba(0, 0, 0, 0.03)';
  }};
    
  /* ${(props) => props.theme.breakpoints.down('sm')} {
    height: 196px;
  } */
  > h3 {
    padding: 0;
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
  .explain {
    margin: 0 0 16px;
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
    > span > span {
      font-weight: 500;
      color: ${(props) => props.theme.colors.text60};
    }
  }
  .tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;

    .KuxCheckbox-wrapper {
      .KuxCheckbox-inner {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid;
        border-color: ${(props) => (props.isChecked ? 'transparent' : props.theme.colors.icon40)};
        background:  ${(props) =>
          (props.isChecked
            ? props.isLight
              ? props.theme.colors.text
              : props.theme.colors.primary
            : 'transparent')};;
      }
      .KuxCheckbox-disabled{
        cursor: not-allowed;
      }
    }
  }
  .rules {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};

    cursor: pointer;
    &::before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      border-top: 1px dashed ${(props) => props.theme.colors.divider8};
    }

    >svg{
      transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'scaleX(1)')};
    }
  }
`;
