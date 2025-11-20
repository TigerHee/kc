/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-02-21 10:42:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-03-04 15:52:09
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/RewardModal.js
 * @Description: 请选择认购币种
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, NumberFormat, styled } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import LazyImg from 'components/common/LazyImg';
import isNil from 'lodash/isNil';
import { _t, _tHTML } from 'tools/i18n';
import Modal from 'TradeActivity/ActivityCommon/Modal';

const StyledModal = styled(Modal)`
  .modal-content {
    padding: 24px;
  }

  .modal-header {
    margin-bottom: 24px;
    padding: 0;

    .modal-title {
      font-weight: 500;
      font-size: 20px;
    }
  }
  .radio-group {
    position: relative;
    z-index: 2;
    padding-top: 28px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  text-align: center;
  .reward-text {
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 24px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 20px;
    line-height: 130%;
    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 32px;
    }
  }
  .reward-num {
    margin-bottom: 16px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
  }
  .reward-amount {
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;

    .value {
      margin-left: 4px;
      color: ${(props) => props.theme.colors.text};
    }
  }
  .reward-desc {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    .tokenNum1,
    .tokenNum2 {
      color: ${(props) => props.theme.colors.text};
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .reward-text {
      margin-bottom: 32px;
    }
  }
`;

const ButtonWrapper = styled.div`
  padding: 24px 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 0 40px;
  }
`;

const RewardModal = ({ visible, onConfirm, rewardInfo }) => {
  const { currentLang } = useLocale();
  const rewardModal = visible;
  const {
    // 认购退回金额（字符串格式，通常是为了保持数值精度）
    refundAmount,
    // 奖励信息金额（数值类型）
    rewardAmount,
    // 奖励信息是否已确认
    rewardConfirmed,
    // 奖励币种信息
    rewardToken,
    // 实际认购支付金额（字符串格式，通常是为了保持数值精度）
    actualAmount,
    // 认购支付币种
    subCurrency,
    // 认购价格（数值类型）
    subPrice,
    // 认购币种logo
    tokenIcon,
  } = rewardInfo || {};

  return (
    <>
      <StyledModal
        onClose={onConfirm}
        destroyOnClose
        open={rewardModal}
        title={_t('d5d26d5fd39f4000a99f')}
      >
        <ContentWrapper>
          <div className="reward-text">
            <LazyImg src={tokenIcon} alt="logo" />
            <span>{rewardToken || ''}</span>
          </div>
          <div className="reward-num">
            {isNil(rewardAmount) ? (
              '--'
            ) : (
              <NumberFormat lang={currentLang} isPositive={+rewardAmount > 0}>
                {rewardAmount}
              </NumberFormat>
            )}
          </div>
          <div className="reward-amount">
            {_t('8ce79696d0154000a502')}
            <span className="value">
              {isNil(subPrice) ? '--' : <NumberFormat lang={currentLang}>{subPrice}</NumberFormat>}
            </span>
          </div>
          <div className="reward-desc">
            {/* 有 refound 的才提示有回退金额, 否则不展示 */}
            {Number(refundAmount)
              ?  _tHTML('9012930ff7d54000ab60', {
                tokenNum1: isNil(actualAmount)
                  ? '--'
                  : numberFormat({
                      number: actualAmount,
                      lang: currentLang,
                    }),
                tokenNum2: isNil(refundAmount)
                  ? '--'
                  : numberFormat({
                      number: refundAmount,
                      lang: currentLang,
                    }),
                tokenName: subCurrency || '',
              })
              // 仅提示实际申购金额
            : _tHTML('ba8d717890cd4000ac2e', {
              tokenNum1: isNil(actualAmount)
                ? '--'
                : numberFormat({
                    number: actualAmount,
                    lang: currentLang,
                  }),
              tokenName: subCurrency || '',
            })}
          </div>
        </ContentWrapper>
        <ButtonWrapper>
          <Button variant="contained" onClick={() => onConfirm()} fullWidth>
            {_t('i.know')}
          </Button>
        </ButtonWrapper>
      </StyledModal>
    </>
  );
};

export default RewardModal;
