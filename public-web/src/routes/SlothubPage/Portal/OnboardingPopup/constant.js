/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-13 15:46:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-28 11:09:16
 */
import { _t } from 'src/tools/i18n';
import UniversalTask from '../../IndexPage/UniversalTasks/UniversalTask';
import GestureAnimation, { GESTURE_DIRECTIONS } from './components/GestureAnimation';
import {
  CommonStepLayout,
  EnhanceBarBgFill,
  InviteWrap,
  PrizeStepLayout,
  SecondStepLayout,
  stepCloseBtnStyles,
  stepDescCardStyles,
  stepRootStyles,
  StyledInviteBar,
  StyledSharedPrizeList,
  StyledTaskList,
} from './styled';

export const triangleDirections = {
  topRight: 'topRight',
  bottomRight: 'bottomRight',
  left: 'left',
};

const GUIDE_MOCK_PRIZES = [
  { currency: 'BTC', earnedPoints: 120, amount: 0.51 },
  { currency: 'PEPE', earnedPoints: 120, amount: 0.51 },
  { currency: 'SHIB', earnedPoints: 120, amount: 0.51 },
  { currency: 'SOL', earnedPoints: 120, amount: 0.51 },
  { currency: 'NOT', earnedPoints: 120, amount: 0.51 },
  { currency: 'CAS', earnedPoints: 120, amount: 0.51 },
  { currency: 'BTC', earnedPoints: 120, amount: 0.51 },
  { currency: 'PEPE', earnedPoints: 120, amount: 0.51 },
  { currency: 'SHIB', earnedPoints: 120, amount: 0.51 },
  { currency: 'SOL', earnedPoints: 120, amount: 0.51 },
];

const getGesturePositionXStyle = (isLeft = true) => {
  return {
    left: isLeft ? -40 : 'unset',
    right: isLeft ? 'unset' : 10,
  };
};

const handleVertical = (list) =>
  list.map((i) => ({
    ...i,
    rootStyle: i.isVerticallyCentered ? stepRootStyles.verticalCenter : i.rootStyle,
  }));

/**
 * isVerticallyCentered 优先级最高会覆盖 rootStyle 属性，指整个模块（内容与描述卡片）垂直居中
 * @param {*} param0
 * @returns
 */
export const mateStepConfigList = ({ isPC, isPad, isH5 }) => {
  const defineConfigList = [
    {
      step: () => _t('19df2e8fc7cd4000a335'),
      title: () => _t('41b8ad8866174000a216'),
      rootStyle: isPC ? stepRootStyles.firstStepPc : stepRootStyles.firstStep,
      descCardDirection: triangleDirections.topRight,
      isVerticallyCentered: true,
      closeBtnStyle: isH5 && stepCloseBtnStyles.h5AbsolutePosition,
      content: (
        <CommonStepLayout>
          <UniversalTask
            guidePoints={{
              kyc: <GestureAnimation style={{ bottom: 28, ...getGesturePositionXStyle() }} />,
              trade: <GestureAnimation style={{ bottom: 28, ...getGesturePositionXStyle() }} />,
            }}
          />
        </CommonStepLayout>
      ),
    },
    {
      step: () => _t('a66b38f5f0324000ae22'),
      title: () => _t('fd74e69ed0474000abda'),
      rootStyle: isPC || isPad ? stepRootStyles.secondStepPc : stepRootStyles.secondStep,
      descCardDirection: triangleDirections.topRight,
      closeBtnStyle: isH5 && stepCloseBtnStyles.h5AbsolutePosition,
      isVerticallyCentered: true,
      content: (
        <SecondStepLayout>
          <StyledTaskList
            guidePoints={{
              enroll: (
                <GestureAnimation
                  gestureDirection={isPC ? GESTURE_DIRECTIONS.left : GESTURE_DIRECTIONS.right}
                  style={{ bottom: 28, ...getGesturePositionXStyle(isPC) }}
                />
              ),
            }}
          />
        </SecondStepLayout>
      ),
    },
    {
      step: () => _t('4e327b64d2764000a38e'),
      title: () => _t('8903436d3a274000a676'),
      content: (
        <InviteWrap>
          <EnhanceBarBgFill />
          <StyledInviteBar
            guidePoints={{
              invite: (
                <GestureAnimation
                  gestureDirection={isPC ? GESTURE_DIRECTIONS.left : GESTURE_DIRECTIONS.right}
                  style={{ bottom: 28, right: isPC ? 40 : 0 }}
                />
              ),
            }}
          />
        </InviteWrap>
      ),
      isVerticallyCentered: true,
      rootStyle: isPC ? stepRootStyles.thirdStepPc : stepRootStyles.thirdStep,
      descCardDirection: triangleDirections.topRight,
      closeBtnStyle: isH5 && stepCloseBtnStyles.h5AbsolutePosition,
    },
    {
      step: () => _t('2b7786b61dd04000a9f1'),
      title: () => _t('b8d9937ffe2a4000ab02'),
      content: (
        <PrizeStepLayout>
          <StyledSharedPrizeList isMockScene prizes={GUIDE_MOCK_PRIZES} />
        </PrizeStepLayout>
      ),
      rootStyle: isPC ? stepRootStyles.fourthStepPc : stepRootStyles.fourthStep,
      descCardDirection: isPC ? triangleDirections.left : triangleDirections.topRight,
      closeBtnStyle:
        isPC || isPad ? stepCloseBtnStyles.fourthStepPc : stepCloseBtnStyles.h5AbsolutePosition,
      descCardStyle: isPad && stepDescCardStyles.fourthStepPad,
      isVerticallyCentered: isH5,
    },
  ];
  return handleVertical(defineConfigList);
};
