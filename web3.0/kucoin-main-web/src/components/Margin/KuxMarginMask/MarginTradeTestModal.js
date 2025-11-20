/**
 * Owner: Ray.Lee@kupotech.com
 */

import React, { memo, Fragment, useCallback, useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { Dialog as KuxDialog, Button, Checkbox, Radio, Spin, Empty, styled } from '@kux/mui';

import MarginAgreementModal from 'components/Margin/MarginAgreementModal';
import { _tHTML, _t } from 'src/tools/i18n';

const Dialog = styled(KuxDialog)`
  .KuxDialog-content {
    max-height: 500px;
    padding-bottom: 0 !important;
  }
  .KuxDialog-body {
    max-height: 100vh;
  }

  .title {
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};

    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
  }

  .group {
    margin-bottom: 8px;
    padding-left: 4px;

    &.item {
      width: 100%;
      margin-bottom: 4px !important;
      padding: 5px 0 !important;
      color: ${({ theme }) => theme.colors.text60} !important;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
    }

    &.right {
      background: ${({ theme }) => theme.colors.primary8};

      .KuxRadio-inner {
        border-color: ${({ theme }) => theme.colors.primary} !important;
      }
    }

    &.error {
      background: ${({ theme }) => theme.colors.secondary8};

      .KuxRadio-inner {
        border-color: ${({ theme }) => theme.colors.secondary} !important;
        &::after {
          background: ${({ theme }) => theme.colors.secondary} !important;
        }
      }
    }
  }

  .footerContent {
    padding: 0 32px 32px;
  }

  .answered {
    margin: 12px 0;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;

    &.highlight {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
    }
  }

  .protocal {
    margin-bottom: 20px !important;
    color: ${({ theme }) => theme.colors.text60} !important;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    a {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

/**
 * MarginTradeTestModal
 * 杠杆交易风险测验 弹窗
 * prd: https://wiki.kupotech.com/pages/viewpage.action?pageId=41752000
 * 1. 都选对和勾选协议才能提交
 * 2. 每道题如果选错了需要提示正确的答案
 */
const MarginTradeTestModal = memo((props) => {
  const dispatch = useDispatch();

  const { open, onOk, ...restProps } = props;
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);
  const [agreementVisible, setAgreementVisible] = useState(false);
  const TEST_OPTIONS = useSelector((state) => state.marginMeta.examContent) || [];

  const loading = useSelector((state) => state.loading.effects['marginMeta/userSignAgreement']);
  const examLoading = useSelector(
    (state) => state.loading.effects['marginMeta/pullMarginTradeExamContent'],
  );

  const handleGroupChange = useCallback((e, i) => {
    setSelected((prev) => ({ ...prev, [i]: e?.target?.value }));
  }, []);

  const handleProtocalClick = (e) => {
    if (e?.target?.nodeName === 'A') {
      setAgreementVisible(true);
      setChecked((prev) => !prev);
    }
  };

  const handleCheckboxChange = useCallback((e) => {
    setChecked(!!e?.target?.checked);
  }, []);

  const handleCloseAgreementModal = useCallback(() => {
    setAgreementVisible(false);
  }, []);

  useEffect(() => {
    if (!open) {
      setSelected({});
      setChecked(false);
    }
  }, [open]);

  useEffect(() => {
    dispatch({
      type: 'marginMeta/pullMarginTradeExamContent',
    });
  }, []);

  const disabled = useMemo(() => {
    const hasError = TEST_OPTIONS.map(({ right }) => right).some(
      (item, index) => item !== selected[index],
    );

    return !checked || hasError;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, selected, JSON.stringify(TEST_OPTIONS)]);

  const rightNum = useMemo(() => {
    const count = TEST_OPTIONS.reduce((acc, { right }, index) => {
      if (right === selected[index]) {
        acc += 1;
      }
      return acc;
    }, 0);
    return `${count}/${TEST_OPTIONS?.length}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, JSON.stringify(TEST_OPTIONS)]);

  return (
    <Fragment>
      <Dialog
        title={_t('ptp6Pw6J9pBFv9oBzQ4XsW')}
        subTitle={_t('eD1eAdTiggMPectdNUJLFH')}
        open={open}
        size="large"
        okText={_t('aRnwMHDubSc6mibmLEjnqK')}
        footer={
          <div className="footerContent">
            <div className="answered">
              {_tHTML('cK3356F74q5r1qrynPVYtj', {
                className: 'highlight',
                text: rightNum,
              })}
            </div>
            <Checkbox className="protocal" onChange={handleCheckboxChange} checked={checked}>
              <span onClick={handleProtocalClick}>{_tHTML('peCSvWcSabqYKtyhnVn72w')}</span>
            </Checkbox>
            <Button type="primary" disabled={disabled} onClick={onOk} loading={loading} fullWidth>
              {_t('aRnwMHDubSc6mibmLEjnqK')}
            </Button>
          </div>
        }
        {...restProps}
      >
        <Spin spinning={examLoading} size="small">
          {TEST_OPTIONS?.length ? (
            TEST_OPTIONS.map(({ title, options, right }, index) => {
              return (
                <Fragment key={title}>
                  <div className="title">
                    {index + 1}.{title}
                  </div>
                  <Radio.Group
                    className="group"
                    onChange={(e) => handleGroupChange(e, index)}
                    value={selected[index]}
                  >
                    {options.map(({ label, value }) => (
                      <Radio
                        value={value}
                        key={value}
                        className={`group item
                          ${value === right && selected[index] ? 'right' : ''}
                          ${value !== right && value === selected[index] ? 'error' : ''}
                        `}
                      >
                        {label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Fragment>
              );
            })
          ) : (
            <Empty />
          )}
        </Spin>
      </Dialog>
      <MarginAgreementModal
        display={agreementVisible}
        showCheckbox={false}
        onClose={handleCloseAgreementModal}
        onConfirm={handleCloseAgreementModal}
      />
    </Fragment>
  );
});

export default MarginTradeTestModal;
