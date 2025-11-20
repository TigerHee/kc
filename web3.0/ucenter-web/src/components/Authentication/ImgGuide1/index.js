/**
 * Owner: lori@kupotech.com
 */
import { ICCloseOutlined, ICHookOutlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { map } from 'lodash';
import tipImg3 from 'static/account/newKyc/kyc2Tip/front-blur.svg';
import tipImg1 from 'static/account/newKyc/kyc2Tip/front-clear-new.svg';
import tipImg2 from 'static/account/newKyc/kyc2Tip/front-cover.svg';
import tipImg4 from 'static/account/newKyc/kyc2Tip/front-no-relective.svg';
import { _t } from 'tools/i18n';
import { TipImgDesc, TipImgs, TipItem, TipItem2 } from './styled';

const TipWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  column-gap: 8px;
  margin-top: 8px;
  width: 100%;
`;

const tipImgs = [
  {
    src: tipImg1,
    tip: 'account.kyc.kyc2.imgGuide1',
    isValid: true,
  },
  {
    src: tipImg2,
    tip: 'account.kyc.kyc2.imgGuide2',
    isValid: false,
  },
  {
    src: tipImg3,
    tip: 'account.kyc.kyc2.imgGuide3',
    isValid: false,
  },
  {
    src: tipImg4,
    tip: 'account.kyc.kyc2.imgGuide4',
    isValid: false,
  },
];

export default () => {
  const theme = useTheme();
  return (
    <TipImgs>
      {map(tipImgs, (tipImg, index) => {
        const Item = index !== 1 ? TipItem : TipItem2;
        return (
          <Item key={index}>
            <img src={tipImg.src} alt="tip-icon" />
            <TipWrapper>
              {tipImg.isValid ? (
                <ICHookOutlined size="16px" color={theme.colors.primary} />
              ) : (
                <ICCloseOutlined size="16px" color={theme.colors.secondary} />
              )}
              <TipImgDesc>{_t(tipImg.tip)}</TipImgDesc>
            </TipWrapper>
          </Item>
        );
      })}
    </TipImgs>
  );
};
