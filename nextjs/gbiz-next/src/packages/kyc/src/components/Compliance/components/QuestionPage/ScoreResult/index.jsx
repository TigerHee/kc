/**
 * Owner: tiger@kupotech.com
 * 记分问卷结果
 */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { styled, Checkbox } from '@kux/mui';
import { Trans } from 'tools/i18n';
import { kcsensorsClick } from 'packages/kyc/src/common/tools';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import { kcsensorsBlockidMap } from '../../../config';
import bgIcon from './img/bg.svg';
import pointerIcon from './img/pointer.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .KuxCheckbox-wrapper {
    display: flex;
  }
  .KuxCheckbox-checkbox {
    margin-top: 4px;
  }
  .divide16 {
    height: 16px;
    flex-shrink: 0;
  }
`;
const WrapperTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 48px;
  width: 100%;
  margin-bottom: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 0 0;
  }
  &.isSmStyle {
    padding: 0;
  }
`;
const DashBoard = styled.div`
  height: 140px;
  width: 100%;
  position: relative;
  .bgIcon {
    width: 180px;
    height: 100px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .pointerIconCommon {
    width: 26px;
    height: 58px;
    transform-origin: 50% 46px;
  }
  .pointerIconBox {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) rotateZ(-90deg);
    z-index: 20;
  }
  .pointerIcon {
  }
  .textWrapper {
    z-index: 30;
  }
  .text {
    position: absolute;
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    white-space: nowrap;
    color: var(--color-text30);
  }
  .text0 {
    top: 58px;
    right: 186px;
  }
  .text1 {
    top: 12px;
    right: 156px;
  }
  .text2 {
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
  }
  .text3 {
    top: 12px;
    left: 156px;
  }
  .text4 {
    top: 58px;
    left: 186px;
  }
  .isTextActive {
    font-weight: 500;
    color: rgba(255, 150, 51, 1);
  }
`;
const LevelBox = styled.div`
  margin: 24px auto 16px;
  width: 100%;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  background-color: var(--color-cover2);
  &.isSmStyle {
    margin: 8px auto 16px;
  }
  .levelTitle {
    font-size: 12px;
    font-weight: 500;
    line-height: 130%;
    margin-bottom: 6px;
    color: var(--color-text);
  }
  .levelContent {
    font-size: 24px;
    font-weight: 700;
    line-height: 130%;
    color: var(--color-text);
  }
`;
const Tip = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  color: var(--color-text60);
  span {
    color: var(--color-primary);
  }
`;
const Desc = styled.span`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  color: var(--color-text60);
  b {
    font-weight: 600;
    color: var(--color-text);
  }
`;
const rotateTotal = 180;

export default ({ curLevelIndex, curLevelItem, setResultChecked }) => {
  const { _t } = useLang();
  const { isSmStyle, flowData } = useCommonData();
  const [isChecked, setChecked] = useState(false);
  const [isChecked2, setChecked2] = useState(false);

  // 'Low', 'Med-Low', 'Med-High', 'High', 'Very High'
  const levelData = [
    _t('714366819a244000a649'),
    _t('455671be050b4000ac40'),
    _t('b6804db0aac04000a45c'),
    _t('4dcdf72e24464000afae'),
    _t('f4a1fcf83c074000ae47'),
  ];
  // 'Low', 'Medium Low', 'Medium High', 'High', 'Very High'
  const levelTextData = [
    _t('714366819a244000a649'),
    _t('72fe79feabda4000ad1a'),
    _t('000f63319b5d4000a5ac'),
    _t('4dcdf72e24464000afae'),
    _t('f4a1fcf83c074000ae47'),
  ];
  // 每格旋转角度
  const rotateUnit = rotateTotal / levelData.length;

  useEffect(() => {
    const blockId = kcsensorsBlockidMap.page_14_result;
    if (blockId) {
      const levelList = ['Low', 'Medium Low', 'Medium High', 'High', 'Very High'];
      kcsensorsClick([blockId, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
        kyc_risklevel: levelList[curLevelIndex],
      });
    }
  }, []);

  useEffect(() => {
    setResultChecked(isChecked && isChecked2);
  }, [isChecked, isChecked2]);

  return (
    <Wrapper
      className={clsx({
        isSmStyle,
      })}
    >
      <WrapperTop
        className={clsx({
          isSmStyle,
        })}
      >
        <DashBoard>
          <img className="bgIcon" src={bgIcon} alt="bgIcon" />
          <div className="pointerIconBox pointerIconCommon">
            <img
              className="pointerIcon pointerIconCommon"
              src={pointerIcon}
              alt="pointerIcon"
              style={{
                transform: `rotateZ(${rotateUnit * curLevelIndex + rotateUnit / 2}deg)`,
              }}
            />
          </div>
          <div className="bgIcon textWrapper">
            {levelData.map((item, index) => (
              <div
                key={item}
                className={clsx({
                  text: true,
                  [`text${index}`]: true,
                  isTextActive: curLevelIndex === index,
                })}
              >
                {item}
              </div>
            ))}
          </div>
        </DashBoard>
        <LevelBox
          className={clsx({
            isSmStyle,
          })}
        >
          <div className="levelTitle">{_t('91508f3af0814000a3ff')}</div>
          <div className="levelContent">{levelTextData[curLevelIndex]}</div>
        </LevelBox>
        <Tip>
          <Trans
            i18nKey="aa074bb6b9954000a96c"
            ns="kyc"
            values={{ number: (curLevelItem?.percentage * 100).toFixed(0) }}
            components={{ span: <span /> }}
          >
            We recommend a Digital Asset investment allocation of <span>less than 5%</span> for your portfolio.
          </Trans>
        </Tip>
      </WrapperTop>

      <Checkbox
        checkOptions={{
          type: 2, // 1黑色 2 灰色
          checkedType: 1, // 1黑色 2 绿色
        }}
        size="small"
        checked={isChecked}
        onChange={e => setChecked(e.target.checked)}
      >
        <Desc>
          <Trans
            i18nKey="c3f046ea63474000afc4"
            ns="kyc"
            values={{ number: (curLevelItem?.percentage * 100).toFixed(0) }}
            components={{ b: <b /> }}
          >
            I acknowledge that
            <b>
              Cryptocurrency is a high-risk investment. Please study and understand the risks of cryptocurrencies
              thoroughly as you may lose the entire investment amount.
            </b>
          </Trans>
        </Desc>
      </Checkbox>
      <div className="divide16" />
      <Checkbox
        checkOptions={{
          type: 2, // 1黑色 2 灰色
          checkedType: 1, // 1黑色 2 绿色
        }}
        size="small"
        checked={isChecked2}
        onChange={e => setChecked2(e.target.checked)}
      >
        <Desc>{_t('91df2a8145054000ab43')}</Desc>
      </Checkbox>
    </Wrapper>
  );
};
