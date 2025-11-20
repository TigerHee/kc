import { useTheme } from '@kux/mui';
import classnames from 'classnames';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useTranslation from '@/hooks/useTranslation';
import error1dark from '@/static/account/kyc/ocr/error1-dark.svg';
import error1 from '@/static/account/kyc/ocr/error1.svg';
import error2dark from '@/static/account/kyc/ocr/error2-dark.svg';
import error2 from '@/static/account/kyc/ocr/error2.svg';
import error3dark from '@/static/account/kyc/ocr/error3-dark.svg';
import error3 from '@/static/account/kyc/ocr/error3.svg';
import idTypeIconDark from '@/static/account/kyc/ocr/id-type-dark.svg';
import idTypeIcon from '@/static/account/kyc/ocr/id-type.svg';
import livingDark from '@/static/account/kyc/ocr/nonDoc/living-dark.svg';
import livingErr1Dark from '@/static/account/kyc/ocr/nonDoc/living-err1-dark.svg';
import livingErr1 from '@/static/account/kyc/ocr/nonDoc/living-err1.svg';
import livingErr2Dark from '@/static/account/kyc/ocr/nonDoc/living-err2-dark.svg';
import livingErr2 from '@/static/account/kyc/ocr/nonDoc/living-err2.svg';
import livingErr3Dark from '@/static/account/kyc/ocr/nonDoc/living-err3-dark.svg';
import livingErr3 from '@/static/account/kyc/ocr/nonDoc/living-err3.svg';
import living from '@/static/account/kyc/ocr/nonDoc/living.svg';
import { SubmitButton } from './styled';

const IMG_CONFIG = {
  light: {
    idTypeIcon,
    error1,
    error2,
    error3,
  },
  dark: {
    idTypeIcon: idTypeIconDark,
    error1: error1dark,
    error2: error2dark,
    error3: error3dark,
  },
};

const IMG_CONFIG_NON_DOC = {
  light: {
    idTypeIcon: living,
    error1: livingErr1,
    error2: livingErr2,
    error3: livingErr3,
  },
  dark: {
    idTypeIcon: livingDark,
    error1: livingErr1Dark,
    error2: livingErr2Dark,
    error3: livingErr3Dark,
  },
};

const OcrRemind = memo(({ isBtnLoading, onClickVerify, isNonDoc, commonIdentityTypeList }) => {
  const { t: _t } = useTranslation();
  const { currentTheme } = useTheme();
  const identityType = useSelector((state) => state.kyc.kycInfo?.identityType);

  const ERROR_EXAMPLES_CONFIG = {
    nonDoc: [
      {
        key: 'error1',
        desc: _t('68aa4b658d5f4000a2b2'),
      },
      {
        key: 'error2',
        desc: _t('8e0005ed445f4000ab1d'),
      },
      {
        key: 'error3',
        desc: _t('9f5cc072dfd34000a7c0'),
      },
    ],
    doc: [
      {
        key: 'error1',
        desc: _t('0c395badc70d4000ad49'),
      },
      {
        key: 'error2',
        desc: _t('3cc12671248d4800a84a'),
      },
      {
        key: 'error3',
        desc: _t('e018b18565744800a342'),
      },
    ],
  };

  const title = useMemo(() => {
    if (isNonDoc) {
      return _t('f88466ee664b4000a602');
    }
    const idType = commonIdentityTypeList?.find((i) => i.type === identityType)?.name;

    if (idType) {
      return _t('1eaedacf3bbe4800a3f8', { idType });
    }
    return '';
  }, [isNonDoc, identityType]);

  const imgData = useMemo(() => {
    return isNonDoc ? IMG_CONFIG_NON_DOC[currentTheme] : IMG_CONFIG[currentTheme];
  }, [isNonDoc, currentTheme]);

  const list = useMemo(() => {
    const config = isNonDoc ? ERROR_EXAMPLES_CONFIG.nonDoc : ERROR_EXAMPLES_CONFIG.doc;
    return config.map((item) => ({
      ...item,
      icon: imgData?.[item.key],
    }));
  }, [isNonDoc, imgData]);

  return (
    <>
      <h2 className="ocrTitle">{title}</h2>

      <div className="typeIconBox">
        <img
          src={imgData?.idTypeIcon}
          alt="type"
          className={classnames({
            typeIcon: true,
            typeIconNonDoc: isNonDoc,
          })}
        />
      </div>

      <div className="errorExampleList">
        {list.map(({ key, icon, desc }) => {
          return (
            <div key={key} className="errorExampleItem">
              <img src={icon} alt="errorExample" className="errorExampleItemIcon" />
              <span className="errorExampleItemDesc">{desc}</span>
            </div>
          );
        })}
      </div>

      <SubmitButton size="large" loading={isBtnLoading} onClick={onClickVerify}>
        {_t('6Rwtu47WMHudsXue7tgH3h')}
      </SubmitButton>
    </>
  );
});

export default OcrRemind;
