/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { styled, Input, Tooltip, useTheme } from '@kux/mui';
import noop from 'lodash/noop';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { ICArrowUpOutlined, ICArrowDownOutlined } from '@kux/icons';
import { useLang } from '../../hookTool';
import { kcsensorsManualTrack } from '../../common/tools';

const Container = styled.div`
  color: ${(props) => props.theme.colors.body};
  font-size: ${(props) => props.theme.fonts.size.lg.fontSize};
`;

const LabelTitle = styled.div`
  color: ${(props) => props.theme.colors.text60};
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text60};
    margin-right: 8px;
  }
`;

const InputWrapper = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

export default function InviteCode({
  defaultExpand = true,
  onChange = noop,
  value,
  onBlur = noop,
  ...others
}) {
  const { t } = useLang();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(defaultExpand);
  const [RCode, setRCode] = useState(value);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const persistenceRcode = queryPersistence.getPersistenceQuery('rcode');
    if (persistenceRcode) {
      setRCode(persistenceRcode);
      setDisabled(true);
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(RCode);
    }
  }, [RCode]);

  const handleChange = useCallback((e) => {
    kcsensorsManualTrack(
      {
        spm: ['createAccount', 'referralCodeSelector'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
          is_login: false,
        },
      },
      'page_click',
    );
    setRCode(e.target.value);
  }, []);

  const handleClickShow = () => {
    setShow(!show);
  };

  const handleBlur = () => {
    typeof onBlur === 'function' && onBlur();
    kcsensorsManualTrack(
      {
        spm: ['createAccount', 'referralCodeInput'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
          is_login: false,
        },
      },
      'page_click',
    );
  };

  return (
    <Container theme={theme} data-inspector="signup_rcode_container">
      {!show ? (
        <LabelTitle onClick={handleClickShow}>
          <Tooltip title={t('referral.tips')} placement="right">
            <span>{t('referral.msg')}</span>
          </Tooltip>
          {show ? (
            <ICArrowUpOutlined size="20" color={colors.icon} />
          ) : (
            <ICArrowDownOutlined size="20" color={colors.icon} />
          )}
        </LabelTitle>
      ) : null}
      <InputWrapper show={show}>
        <Input
          size="xlarge"
          disabled={disabled}
          style={{ width: '100%' }}
          value={RCode}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          data-inspector="signup_rcode_input"
          {...others}
        />
      </InputWrapper>
    </Container>
  );
}
