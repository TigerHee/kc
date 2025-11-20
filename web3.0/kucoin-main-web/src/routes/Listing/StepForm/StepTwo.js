/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import moment from 'moment';
import { trim } from 'lodash';
import { Form, Input, Button, Checkbox, Row, Col } from '@kufox/mui';
import DatePicker from '../DatePicker';
import { useSnackbar } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import { _t, _tHTML } from 'tools/i18n';
import { getTimestampByZone, getSystemTimestamp } from '../common/config';
import { StepTitle } from '../common/StyledComps';

const { FormItem, useForm } = Form;

const FormStyle = styled(Form)`
  width: 588px;
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 15px;
  }
`;

const DatePickerStyle = styled(DatePicker)`
  width: 100%;
  height: 48px;
  .rc-picker-input {
    height: 48px;
  }
`;

const BtnGroup = styled.div``;

const SubmitButton = styled(Button)`
  min-width: 282px;
  margin-top: 50px;
  border-radius: 6px;
  font-weight: 500;
  :last-child {
    margin-left: 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 48.7%;
    max-width: 48.7%;
    :last-child {
      margin-left: 2.6%;
    }
  }
`;

const LabelWrapper = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
`;

const Label = styled.span``;

const ExtraInfo = styled.span``;

const CheckboxGroupStyle = styled(Checkbox.Group)`
  margin-top: 8px;
`;

function StepTwo() {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { detail } = useSelector((state) => state.listing);
  const loading = useSelector((state) => state.loading.effects['listing/saveDraft']);

  const { sm, md, lg } = useResponsive();
  const isMobile = sm && !md && !lg;

  const [form] = useForm();
  const projectName = Form.useWatch('projectName', form);
  const projectCode = Form.useWatch('projectCode', form);
  const projectWebsite = Form.useWatch('projectWebsite', form);
  const projectNature = Form.useWatch('projectNature', form);
  const discussionSpecify = Form.useWatch('discussionSpecify', form);
  const timelineListing = Form.useWatch('timelineListing', form);
  const btnDisable =
    projectName &&
    projectCode &&
    projectWebsite &&
    projectNature &&
    discussionSpecify &&
    timelineListing
      ? false
      : true;

  useEffect(() => {
    form.setFieldsValue({
      projectName: detail.projectName,
      projectCode: detail.projectCode,
      projectWebsite: detail.projectWebsite,
      projectNature: detail.projectNature,
      discussionSpecify: detail.discussionSpecify,
      timelineListing: detail.timelineListing
        ? moment(getSystemTimestamp(detail.timelineListing))
        : undefined,
      referredBy: detail.referredBy,
      thirdPartySpecify: detail.thirdPartySpecify,
      marketMakersSpecify: detail.marketMakersSpecify,
    });
  }, []);

  const handlePrev = () => {
    dispatch({
      type: 'listing/update',
      payload: {
        applyCurrentStep: 0,
      },
    });
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    form.validateFields().then((values) => {
      const params = {
        projectName: trim(values.projectName),
        projectCode: trim(values.projectCode),
        projectWebsite: trim(values.projectWebsite),
        projectNature: values.projectNature,
        discussionSpecify: trim(values.discussionSpecify),
        timelineListing: getTimestampByZone(values.timelineListing.valueOf()),
        referredBy: trim(values.referredBy),
        thirdPartySpecify: trim(values.thirdPartySpecify),
        marketMakersSpecify: trim(values.marketMakersSpecify),
      };
      dispatch({
        type: 'listing/saveDraft',
        payload: {
          ...params,
        },
      }).then((res) => {
        const { success, data, code } = res || {};
        if (success && data && code === '200') {
          dispatch({
            type: 'listing/update',
            payload: {
              applyCurrentStep: 2,
              detail: { ...detail, ...params },
            },
          });
          window.scrollTo(0, 0);
        } else {
          message.error(_t('kMRN1jq8WnLWWXgo7tSCEh'));
        }
      });
    });
  };

  const customLabel = (label, extraInfo) => {
    return (
      <LabelWrapper>
        <Label>{label} </Label>
        {extraInfo ? <ExtraInfo>{extraInfo}</ExtraInfo> : null}
      </LabelWrapper>
    );
  };

  return (
    <>
      <StepTitle>{_t('3bk3TbhWRhkdZvXj4GztLY')}</StepTitle>
      <FormStyle form={form}>
        <FormItem
          label={_t('nCRjRBdGzG2hvs3RqrVodX')}
          name="projectName"
          rules={[
            { required: true, message: _t('6gB5ZkjzEKCnBS6KUFLVqT') },
            {
              validator: (_, val, cb) => {
                if (val.length > 60) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 60 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('6gB5ZkjzEKCnBS6KUFLVqT')} size="large" />
        </FormItem>
        <FormItem
          label={_t('cAKYcShS2acZSPFwtC6rHQ')}
          name="projectCode"
          rules={[
            { required: true, message: _t('vRwKgQGJCTmFDtBBgd1WZV') },
            {
              validator: (_, val, cb) => {
                if (val.length > 60) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 60 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('vRwKgQGJCTmFDtBBgd1WZV')} size="large" />
        </FormItem>
        <FormItem
          label={_t('4mUsrHXACF17134P2XLocB')}
          name="projectWebsite"
          rules={[
            { required: true, message: _t('goafDB6wfExUSsdbibUpYd') },
            {
              validator: (_, val, cb) => {
                if (val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('goafDB6wfExUSsdbibUpYd')} size="large" />
        </FormItem>
        <FormItem
          label={_t('dkCNPNE2PcSN3Xwd8Gjk5u')}
          name="projectNature"
          rules={[{ required: true, message: _t('hEy7t33bKULdx6wYFiU1Yu') }]}
        >
          <CheckboxGroupStyle>
            <Row gutter={[0, 12]}>
              <Col span={12}>
                <Checkbox value="DeFi">DeFi</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="NFT">NFT</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="Stable Coin">Stable Coin</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="L1/L2 Protocols">L1/L2 Protocols</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="Dapp">Dapp</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="Currency">Currency</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="PoW Coins">PoW Coins</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="GameFi/Metaverse">GameFi/Metaverse</Checkbox>
              </Col>
              <Col span={isMobile ? 24 : 12}>
                <Checkbox value="Infrastructure(Bridge,Oracle,EVM,etc.)">
                  Infrastructure(Bridge,Oracle,EVM,etc.)
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="other">{_t('2kTgrqUXmL45QQjzDmXnf6')}</Checkbox>
              </Col>
            </Row>
          </CheckboxGroupStyle>
        </FormItem>
        <FormItem
          label={_t('x13MWBsPoH6vGBeHZ1uHdR')}
          name="discussionSpecify"
          rules={[
            { required: true, message: _t('cjqhbzZFyhwKfKSyG3NyaS') },
            {
              validator: (_, val, cb) => {
                if (val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('phQoz8M7TvJDVJL7t9gw1a')} size="large" />
        </FormItem>
        <FormItem
          label={`${_t('qJ6GWZYzZVgFFJ34ngisCr')} (UTC)`}
          name="timelineListing"
          rules={[{ required: true, message: _t('assets.por.step.time') }]}
        >
          <DatePickerStyle placeholder={_t('assets.por.step.time')} showTime size="large" />
        </FormItem>
        <FormItem
          label={customLabel(_t('k7GLnKSE1hptwZWJx7CskC'), _t('jEnd2sv2iDUn9X6XbyrLKs'))}
          name="referredBy"
          rules={[
            {
              validator: (_, val, cb) => {
                if (val && val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('phQoz8M7TvJDVJL7t9gw1a')} size="large" />
        </FormItem>
        <FormItem
          label={_t('kDZ7gfW97sazN8kCGXCDA3')}
          name="thirdPartySpecify"
          rules={[
            {
              validator: (_, val, cb) => {
                if (val && val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('phQoz8M7TvJDVJL7t9gw1a')} size="large" />
        </FormItem>
        <FormItem
          label={customLabel(_t('kanaGAYg3RQXDP3ufvxX8u'))}
          name="marketMakersSpecify"
          rules={[
            {
              validator: (_, val, cb) => {
                if (val && val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('phQoz8M7TvJDVJL7t9gw1a')} size="large" />
        </FormItem>
      </FormStyle>
      <BtnGroup>
        <SubmitButton size="large" variant="outlined" onClick={handlePrev}>
          {_t('fiat.last.step')}
        </SubmitButton>
        <SubmitButton size="large" loading={loading} disabled={btnDisable} onClick={handleNext}>
          {_t('hc8AVtnbYdDu2XtUazZwGC')}
        </SubmitButton>
      </BtnGroup>
    </>
  );
}

export default StepTwo;
