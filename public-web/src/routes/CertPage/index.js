/**
 * Owner: brick.fan@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { useMediaQuery } from '@kufox/mui';
import { Button, EmotionCacheProvider, Input, Select, styled, Tooltip } from '@kux/mui';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { searchAccount } from 'services/cert';
import { saTrackForBiz, trackClick } from 'src/utils/ga';
import Bg1SVG from 'static/cert/bg1.svg';
import Bg2SVG from 'static/cert/bg2.svg';
import Bg3SVG from 'static/cert/bg3.svg';
import Bg4SVG from 'static/cert/bg4.svg';
import RightArrowSVG from 'static/cert/right-arrow.svg';
import { _t } from 'tools/i18n';
import { typeList } from './config';
import FailModal from './FailModal';
import SuccessModal from './SuccessModal';

const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: rgba(18, 18, 18, 1);
  position: relative;
  overflow: hidden;

  .bg {
    position: absolute;
    top: 0;
    opacity: 0.3;
  }
  .bg-1 {
    top: 115px;
    left: -32px;
  }
  .bg-2 {
    top: 418px;
    left: -118px;
  }
  .bg-3 {
    top: -34px;
    right: -43px;
  }
  .bg-4 {
    top: 394px;
    right: -24px;
  }
  ${(props) => props.theme.breakpoints.up('xl')} {
    min-height: calc(100vh - 80px);
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    .bg {
      display: none;
    }
    .bg-2 {
      bottom: 95px !important;
      left: -93px !important;
      display: block;
    }
    .bg-3 {
      top: -58px !important;
      right: -58px !important;
      display: block;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: calc(100vh - 64px);
    .bg {
      display: none;
    }
    .bg-3 {
      top: unset !important;
      right: -26px !important;
      bottom: -104px !important;
      display: block;
    }
  }
`;

// const HeaderWrapper = styled.div`
//   height: 44px;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: 2;
//   svg {
//     transform: rotate(180deg);
//     width: 20px;
//     height: 20px;
//     position: absolute;
//     left: 16px;
//     top: 12px;
//     color: #F3F3F3;
//   }
//   .header-title {
//     color: #F3F3F3;
//     font-size: 18px;
//     font-weight: 600;
//     line-height: 130%;
//     text-align: center;
//     padding: 10px 52px;
//     word-break: break-all;
//     text-overflow: ellipsis;
//     width: 100%;
//     white-space: nowrap;
//     overflow: hidden;
//   }
// `;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 856px;
  margin: 0 auto;
  padding-top: 216px;
  padding-bottom: 216px;
  position: relative;
  z-index: 1;

  .labelText {
    pointer-events: none;
  }

  .title {
    color: rgba(255, 255, 255, 1);
    font-weight: 600;
    font-size: 44px;
    line-height: 130%;
  }

  .desc {
    margin-top: 24px;
    color: rgba(243, 243, 243, 0.6);
    font-size: 16px;
    line-height: 150%;
    text-align: center;
  }

  .pc-action-area {
    .inputWrapper {
      width: 840px;
      margin-top: 48px;
      padding-right: 8px;
      padding-left: 8px;
      background: white;
      border-radius: 32px;

      .KuxInput-input {
        height: 64px;
        margin-right: 16px;
        &::placeholder {
          font-weight: 400;
        }
      }

      .KuxInput-addonBefore + .KuxDivider-root {
        width: 0.5px;
        height: 24px;
        margin-right: 24px;
        margin-left: 0;
        background-color: rgba(29, 29, 29, 0.12);
        /* [dir='rtl'] & {
          margin-right: 8px;
          margin-left: 24px;
        } */
      }

      .KuxSelect-wrapper {
        width: 237px;
        margin-left: -8px;
        padding-left: 0;

        .KuxSelect-dropdownIcon svg {
          fill: #8c8c8c;
        }
      }

      .KuxButton-root {
        padding-right: 24px;
        background-color: #01bc8d;
        &:hover {
          background-color: #01bc8d;
        }
        .KuxButton-endIcon {
          width: 20px;
          height: 20px;
          margin-left: 4px;
        }
      }

      fieldset {
        border: none;
      }
    }

    .error-line {
      position: relative;
      width: 800px;
      margin-top: 4px;
    }

    .error-text {
      position: absolute;
      left: ${(props) => props.left || 0};
      color: #f65454;
      font-size: 12px;
      line-height: 16px;
    }
    .error-text-left {
      left: 16px;
      /* [dir='rtl'] & {
        right: 6px;
        left: unset;
      } */
    }
    .error-text-right {
      left: 188px;
      /* [dir='rtl'] & {
        right: 188px;
        left: unset;
      } */
    }
  }

  .h5-action-area {
    width: 100%;
    margin-top: 48px;
    .KuxSelect-root {
      background: white;
      border-radius: 28px;
      .KuxSelect-dropdownIcon svg {
        fill: #8c8c8c;
      }
      fieldset {
        border: none;
      }
    }
    .KuxInput-root {
      margin-top: 16px;
      background: white;
      border-radius: 28px;
      fieldset {
        border: none;
      }
      input::placeholder {
        font-weight: 400;
      }
    }
    .KuxButton-root {
      width: 100%;
      margin-top: 20px;
      background-color: #01bc8d;
      &:hover {
        background-color: #01bc8d;
      }
      .KuxButton-endIcon {
        width: 20px;
        height: 20px;
        margin-left: 4px;
      }
    }
    .error-text {
      margin-top: 4px;
      padding-left: 16px;
      color: #f65454;
      font-size: 12px;
      line-height: 16px;
      /* [dir='rtl'] & {
        padding-right: 16px;
        padding-left: unset;
      } */
    }
  }

  .KuxSelect-root {
    /* .KuxSelect-icon {
      [dir='rtl'] & {
        right: unset;
        left: 16px;
      }
    }
    .KuxSelect-searchPlaceholder {
      [dir='rtl'] & {
        padding-right: unset;
        padding-left: 18px;
      }
    }
    .KuxSelect-wrapper > div {
      [dir='rtl'] & {
        padding-right: 4px;
        padding-left: 18px;
      }
    } */
  }

  .KuxButton-endIcon {
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 191px 24px;
    .desc {
      padding-right: 20px;
      padding-left: 20px;
    }
    .pc-action-area {
      width: 100%;
      .inputWrapper {
        width: 100%;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 87px 20px 87px 20px;
    .desc {
      padding-right: 0;
      padding-left: 0;
      font-size: 13px;
      text-align: left;
      /* [dir='rtl'] & {
        text-align: right;
      } */
    }
    .title {
      font-size: 24px;
      text-align: center;
    }
  }
`;

const SelectLabel = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 6px;
    /* [dir='rtl'] & {
      margin-right: unset;
      margin-left: 6px;
    } */
  }
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const LabelDeal = ({ label }) => {
  const labelRef = useRef(null);
  const [isNeedTooltip, setNeedTooltip] = useState(false);
  useEffect(() => {
    if (labelRef.current) {
      const { width } = labelRef.current.getBoundingClientRect();
      setNeedTooltip(width >= 110);
    }
  }, []);

  return isNeedTooltip ? (
    <Tooltip title={label} placement="top">
      <div className="labelText">
        <span ref={labelRef}>{label}</span>
      </div>
    </Tooltip>
  ) : (
    <div className="labelText">
      <span ref={labelRef}>{label}</span>
    </div>
  );
};

const CertPage = () => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { isRTL } = useLocale();

  const [type, setType] = useState();
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(false);

  const [showTypeError, setShowTypeError] = useState(false);
  const [showAccountError, setShowAccountError] = useState(false);

  const [showOfficial, setShowOfficial] = useState(false);
  const [showUnOfficial, setShowUnOfficial] = useState(false);
  const [resultType, setResultType] = useState('');

  useEffect(() => {
    // TODO
    // setTimeout(() => {
    //   document.title = _t('cert.official');
    // }, 1000);
    try {
      saTrackForBiz({}, ['ViewH5', '1'], {});
    } catch (error) {}
  }, []);

  const handleSearch = async () => {
    const trimedAccount = _.trim(account);
    let error = false;
    if (!type) {
      setShowTypeError(true);
      error = true;
    }
    if (!trimedAccount) {
      setShowAccountError(true);
      error = true;
    }

    if (error) {
      return;
    }
    trackClick(['Check', '1']);

    setLoading(true);

    try {
      const res = await searchAccount({ type: Number(type), content: trimedAccount });
      setShowOfficial(true);
      setResultType(res.data);
    } catch (e) {
      if (e && e.code !== '200') {
        setShowUnOfficial(true);
      } else {
        console.log(e.message);
      }
    }
    setLoading(false);
  };

  const renderSelect = () => {
    return (
      <Select
        placeholder={_t('uhRZYMHwZvYNCwHHD1odkF')}
        value={type}
        onChange={(value) => {
          setShowTypeError(false);
          setType(value);
        }}
        options={typeList.map((item) => {
          return {
            ...item,
            label: (
              <SelectLabel>
                <img src={item.icon} alt="" />
                <LabelDeal label={item?.noTranslate ? item.label : _t(item.label)} />
              </SelectLabel>
            ),
          };
        })}
        size="xlarge"
      />
    );
  };

  const renderButton = () => {
    return (
      <Button
        size="large"
        endIcon={!loading && <img src={RightArrowSVG} alt="" />}
        loading={loading}
        onClick={handleSearch}
      >
        {_t('cert.search')}
      </Button>
    );
  };

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <Wrapper data-inspector="cert-page">
        {/* {!!isH5 &&
        <HeaderWrapper>
          <ICArrowRight2Outlined onClick={() => {
            window.history.back();
          }} />
          <div className='header-title'>
            {_t('cert.official')}
          </div>
        </HeaderWrapper>
      } */}
        <ContentWrapper>
          <div className="title">{_t('1LEymcZGVMPC4pagjUMv5x')}</div>
          <div className="desc">
            <p>{_t('dzGiYUDxHsDxdReTstUFsS')}</p>
            <p>{_t('muusCXGWMGKTXBMikUQbKP')}</p>
            <br />
            <p>{_t('8AzxiYQNpPD1QUEicu2dEg')}</p>
          </div>
          {isH5 ? (
            <div className="h5-action-area">
              {renderSelect()}
              {showTypeError && <div className="error-text">{_t('qxHb4nx92rXfXLLHYbYbUS')}</div>}
              <Input
                placeholder={_t('mLKrJaGhhhK7nkbFsSSq5D')}
                allowClear
                size="xlarge"
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  setShowAccountError(false);
                }}
              />
              {showAccountError && <div className="error-text">{_t('cert.form.required')}</div>}
              {renderButton()}
            </div>
          ) : (
            <div className="pc-action-area">
              <Input
                className="inputWrapper"
                placeholder={_t('mLKrJaGhhhK7nkbFsSSq5D')}
                allowClear
                size="xlarge"
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  setShowAccountError(false);
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                addonBefore={renderSelect()}
                addonAfter={renderButton()}
              />
              <div className="error-line">
                {showTypeError && (
                  <div className="error-text error-text-left">{_t('qxHb4nx92rXfXLLHYbYbUS')}</div>
                )}
                {showAccountError && (
                  <div className="error-text error-text-right">{_t('cert.form.required')}</div>
                )}
              </div>
            </div>
          )}
        </ContentWrapper>
        <img className="bg bg-1" alt="" src={Bg1SVG} />
        <img className="bg bg-2" alt="" src={Bg2SVG} />
        <img className="bg bg-3" alt="" src={Bg3SVG} />
        <img className="bg bg-4" alt="" src={Bg4SVG} />
        <SuccessModal
          visible={showOfficial}
          onCancel={() => setShowOfficial(false)}
          account={account}
          type={type}
          isH5={isH5}
        />
        <FailModal
          visible={showUnOfficial}
          onCancel={() => setShowUnOfficial(false)}
          account={account}
          type={type}
          isH5={isH5}
        />
      </Wrapper>
    </EmotionCacheProvider>
  );
};

export default CertPage;
