/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment, useCallback, useState, useEffect, useMemo } from 'react';
import Button from '@mui/Button';
import Checkbox from '@mui/Checkbox';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';
import { _tHTML, _t } from 'src/utils/lang';
import DialogAgreement from './DialogAgreement';
import classNames from 'classnames';
import {
  DialogWrapper,
  Group,
  FooterWrapper,
  RadioItem,
  ItemTitle,
  Answered,
  Protocal,
  Content,
} from './style';
import useSensorFunc from '@/hooks/useSensorFunc';

/**
 * DialogAnswer
 * 风险测验 弹窗
 * prd: https://wiki.kupotech.com/pages/viewpage.action?pageId=41752000
 * 1. 都选对和勾选协议才能提交
 * 2. 每道题如果选错了需要提示正确的答案
 */
const DialogAnswer = (props) => {
  const {
    open,
    onOk,
    title: _title,
    okText,
    answerOptions: TEST_OPTIONS,
    answerExamApi,
    answerSubmitApiLoading,
    answerExamApiLoading,
    answerDialogProtocalText,
    answerProtocalSensor,
    answerExposeSensor,

    agreementTitle,
    agreementContent,
    agreementApi,
    agreementApiLoading,
    ...restProps
  } = props;
  const sensorFunc = useSensorFunc();

  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);
  const [agreementVisible, setAgreementVisible] = useState(false);

  const handleGroupChange = useCallback((e, i) => {
    setSelected((prev) => ({ ...prev, [i]: e?.target?.value }));
  }, []);

  const handleProtocalClick = (e) => {
    if (e?.target?.nodeName === 'A') {
      setAgreementVisible(true);
      setChecked((prev) => !prev);
      // 点击协议埋点
      answerProtocalSensor && sensorFunc(answerProtocalSensor);
    }
  };

  const handleCheckboxChange = useCallback((e) => {
    setChecked(!!e?.target?.checked);
  }, []);

  useEffect(() => {
    if (!open) {
      setSelected({});
      setChecked(false);
    } else {
      answerExposeSensor && sensorFunc(answerExposeSensor);
    }
  }, [open, sensorFunc]);

  useEffect(() => {
    answerExamApi && answerExamApi();
  }, []);

  const disabled = useMemo(() => {
    const hasError = TEST_OPTIONS?.map(({ right }) => right).some(
      (item, index) => item !== selected[index],
    );

    return !checked || hasError;
  }, [checked, selected, JSON.stringify(TEST_OPTIONS)]);

  const rightNum = useMemo(() => {
    const count = TEST_OPTIONS.reduce((acc, { right }, index) => {
      if (right === selected[index]) {
        acc += 1;
      }
      return acc;
    }, 0);
    return `${count}/${TEST_OPTIONS?.length}`;
  }, [selected, JSON.stringify(TEST_OPTIONS)]);

  return (
    <Fragment>
      <DialogWrapper
        title={_title}
        // subTitle={_t('eD1eAdTiggMPectdNUJLFH')}
        open={open}
        size="medium"
        footer={
          <FooterWrapper>
            <Answered>
              {_tHTML('cK3356F74q5r1qrynPVYtj', {
                className: 'highlight',
                text: rightNum,
              })}
            </Answered>
            <Checkbox onChange={handleCheckboxChange} checked={checked}>
              <Protocal onClick={handleProtocalClick}>
                {/* {_tHTML('peCSvWcSabqYKtyhnVn72w')} */}
                {answerDialogProtocalText}
              </Protocal>
            </Checkbox>
            <Button
              type="primary"
              disabled={disabled}
              onClick={onOk}
              loading={answerSubmitApiLoading}
              fullWidth
            >
              {okText}
            </Button>
          </FooterWrapper>
        }
        {...restProps}
      >
        <Spin spinning={answerExamApiLoading}>
          <Content>
            {TEST_OPTIONS?.length ? (
              TEST_OPTIONS.map(({ title, options, right }, index) => {
                return (
                  <Fragment key={title}>
                    <ItemTitle>
                      {index + 1}.{title}
                    </ItemTitle>
                    <Group onChange={(e) => handleGroupChange(e, index)} value={selected[index]}>
                      {options.map(({ label, value }) => (
                        <RadioItem
                          value={value}
                          key={value}
                          size="small"
                          className={classNames({
                            right: value === right && selected[index],
                            error: value !== right && value === selected[index],
                          })}
                        >
                          {label}
                        </RadioItem>
                      ))}
                    </Group>
                  </Fragment>
                );
              })
            ) : (
              <div style={{ height: '300px' }}>
                <Empty />
              </div>
            )}
          </Content>
        </Spin>
      </DialogWrapper>
      <DialogAgreement
        open={agreementVisible}
        onCancel={() => setAgreementVisible(false)}
        onOk={() => setAgreementVisible(false)}
        title={agreementTitle}
        agreementContent={agreementContent}
        agreementApi={agreementApi}
        agreementApiLoading={agreementApiLoading}
      />
    </Fragment>
  );
};

export default memo(DialogAnswer);
