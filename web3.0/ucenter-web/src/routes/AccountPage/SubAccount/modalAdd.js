/**
 * Owner: willen@kupotech.com
 */
import { Alert, Checkbox, Dialog, Form, Input, px2rem, Select, styled, Tooltip } from '@kux/mui';
import { Global } from '@kux/mui/emotion';
import { injectLocale } from 'components/LoadLocale';
import React from 'react';
import withMultiSiteConfig from 'src/hocs/withMultiSiteConfig';
import Tips from 'static/assets/ic_info.svg';
import { _t } from 'tools/i18n';
import { validatePwd } from 'utils/validate';
import {
  SUB_ACCOUNT_MAP,
  SUB_ACCOUNT_TYPE_HOSTED,
  SUB_ACCOUNT_TYPE_NORMAL,
  SUB_ACCOUNT_TYPE_OES,
  SUB_ACCOUNT_TYPE_VALUE_MAP,
} from './config';
import ModalBase from './modalBase';

const SubAccountSelectDesc = styled('div')`
  color: ${(props) => props.theme.colors.text40};
  font-family: Kufox Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  padding-top: 4px;
  white-space: break-spaces;
`;

// 创建不同子账号类型文案描述
const SUB_ACCOUNT_TYPE_LIST = [
  {
    label: (
      <>
        <div>{_t('rh6rV2cDHJPc3Q48qD9bmP')}</div>
        <SubAccountSelectDesc className="sub-account-select-desc">
          {_t('27dd7807b1de4000af8e')}
        </SubAccountSelectDesc>
      </>
    ),
    value: String(SUB_ACCOUNT_TYPE_NORMAL),
  },
  {
    label: (
      <>
        <div>{_t('bcaa4hdNkQiBCrMFN87YVL')}</div>
        <SubAccountSelectDesc className="sub-account-select-desc">
          {_t('b55f001c2e5e4800a577')}
        </SubAccountSelectDesc>
      </>
    ),
    value: String(SUB_ACCOUNT_TYPE_HOSTED),
  },
  {
    label: (
      <>
        <div>{_t('d337ebb3c7964000a918')}</div>
        <SubAccountSelectDesc className="sub-account-select-desc">
          {_t('13026820d2704000a5ed')}
        </SubAccountSelectDesc>
      </>
    ),
    value: String(SUB_ACCOUNT_TYPE_OES),
  },
];

const StyledDialog = styled(Dialog)`
  overflow: hidden;
  .KuxDialog-content {
    display: block;
    max-height: calc(100vh - 30vh - 90px);
    overflow-y: auto;
  }
  .KuxModalFooter-root {
    padding: 0 32px 32px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxModalFooter-root {
      padding: 8px 32px 32px 32px !important;
    }
  }
`;

const TipWrapper = styled.div`
  display: flex;
  font-size: ${px2rem(12)};
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  margin-bottom: ${() => px2rem(4)};
  align-items: center;
  justify-content: space-between;
  .KuxForm-item {
    span {
      font-weight: 500 !important;
    }
  }
  .KuxForm-itemHelp {
    display: none !important;
  }
`;

const Box = styled.div`
  height: ${() => px2rem(20)};
`;

const LabelSpan = styled.span`
  font-size: ${px2rem(12)};
  margin-top: ${px2rem(4)};
  color: ${(props) => props.theme.colors.text40};
`;

const FormWrapper = styled.div`
  margin-bottom: 8px;
  .KuxForm-itemHelp {
    min-height: ${px2rem(14)} !important;
  }
  .KuxForm-itemError {
    line-height: 16px;
  }
`;
const AlertCnt = styled.div`
  margin-bottom: 20px;
  .KuxAlert-icon {
    padding-top: 4px;
  }
`;
const TipsImg = styled.img`
  width: 16px;
  height: 16px;
`;

const AccountSelect = styled(Select)`
  .KuxSelect-itemLabel {
    .sub-account-select-desc {
      display: none;
    }
  }
  .KuxSelect-itemIcon {
    display: none;
  }
`;

const ExtendInput = styled(Input)`
  input {
    font-weight: 500;
    caret-color: ${({ theme }) => theme.colors.primary};
  }
`;

const { FormItem, withForm } = Form;

@withForm()
@injectLocale
class ModalAdd extends ModalBase {
  state = {
    typeMap: this.props.count,
    // 接口返回的子账号权限, 多租户改造先不调用，等产品出整体的子账号权限相关需求
    // subUserTypePermissionMap: {},
  };

  requiredFields = ['subName', 'password'];

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps?.visible && !this.props?.visible) {
      const { count } = nextProps;
      this.handleDefaultReset(count);
    }
  }

  // fetchSubAccess = () => {
  //   queryUserSubAccess()
  //     .then((res) => {
  //       console.log('res...', res);
  //       const { success, data } = res;
  //       if (success) {
  //         this.setState({
  //           subUserTypePermissionMap: data,
  //         });
  //       } else {
  //         res?.msg && message.error(res?.msg);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err?.msg) {
  //         message.error(err?.msg);
  //       }
  //     });
  // };

  handleDefaultReset = (count) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      [SUB_ACCOUNT_MAP.spot]: false,
      [SUB_ACCOUNT_MAP.margin]: false,
      [SUB_ACCOUNT_MAP.futures]: false,
      [SUB_ACCOUNT_MAP.option]: false,
    });
    // 接口返回的子账号权限, 多租户改造先不调用，等产品出整体的子账号权限相关需求
    // this.fetchSubAccess();
    this.setState({ typeMap: count });
  };

  accountNameValidator = (rule, val, callback) => {
    const len = val.toString().length || 0;
    if (len < 7 || len > 24 || /[^a-zA-Z0-9]+/.test(val) || /^[0-9]*$/.test(val)) {
      callback(_t('password.rule'));
      return;
    }
    callback();
  };

  passwordValidator = (rule, val, callback) => {
    const { check = true } = validatePwd(val) || {};
    if (!check) {
      callback(_t('form.password.error'));
      return;
    }
    callback();
  };

  handleChange = (e, type) => {
    const { typeMap } = this.state;
    const checked = e?.target?.checked;
    this.setState({
      typeMap: {
        ...typeMap,
        [type]: checked ? typeMap?.[type] - 1 : typeMap?.[type] + 1,
      },
    });
  };

  hasPermission = (optionType, subAccountType) => {
    const { multiSiteConfig } = this.props;
    // const { subUserTypePermissionMap } = this.state;
    // 多租户中的子账号权限配置
    const subUserTypePermissionMapWithMultipleSite =
      multiSiteConfig?.accountConfig?.subUserTypePermissionMap || {};
    const currentTypePermissionWithMultipleSite =
      subUserTypePermissionMapWithMultipleSite[SUB_ACCOUNT_TYPE_VALUE_MAP[subAccountType]] || [];

    // 接口中的子账号权限
    // const currentTypePermissionWithApi =
    //   subUserTypePermissionMap[SUB_ACCOUNT_TYPE_VALUE_MAP[subAccountType]] || [];
    // 全部小写
    const validPermissionWithMultipleSite =
      currentTypePermissionWithMultipleSite?.map((p) => p?.toUpperCase()) ?? [];
    // const validPermissionWithApi = currentTypePermissionWithApi?.map((p) => p?.toUpperCase());

    // 多站点配置需要满足
    return validPermissionWithMultipleSite.includes(optionType?.toUpperCase());
    // && validPermissionWithApi.includes(optionType?.toUpperCase())
  };

  render() {
    const {
      visible,
      form,
      onCancel,
      count,
      multiSiteConfig,
      oesSubEnabled,
      oesCustodyList,
      ...rest
    } = this.props;
    const { getFieldValue } = form || {};
    const type = Number(getFieldValue('type'));
    // 三方资管子账号和托管子账号是一个类型，普通子账号是一类，只需要判断普通子账号即可
    const isNormalType = type === SUB_ACCOUNT_TYPE_NORMAL;
    const isOES = type === SUB_ACCOUNT_TYPE_OES;

    const typeListFromMultiSiteConfig = [];

    const subUserTypePermissionMap = multiSiteConfig?.accountConfig?.subUserTypePermissionMap || {};
    const currentTypePermission = subUserTypePermissionMap[SUB_ACCOUNT_TYPE_VALUE_MAP[type]] || [];

    // map 存在该字段，并且作为数组，要配有该子账号存在的交易权限
    // 存在普通子账号权限
    const hasNormalSubType =
      subUserTypePermissionMap.NORMAL && subUserTypePermissionMap.NORMAL.length;
    // 存在托管子账号权限
    const hasHostedSubType =
      subUserTypePermissionMap.HOSTED && subUserTypePermissionMap.HOSTED.length;
    // 存在三方资金托管子账号
    const hasOESSubType =
      oesSubEnabled && subUserTypePermissionMap.OES && subUserTypePermissionMap.OES.length;

    if (hasNormalSubType) {
      typeListFromMultiSiteConfig.push(SUB_ACCOUNT_TYPE_LIST[0]);
    }
    if (hasHostedSubType) {
      typeListFromMultiSiteConfig.push(SUB_ACCOUNT_TYPE_LIST[1]);
    }
    if (hasOESSubType) {
      typeListFromMultiSiteConfig.push(SUB_ACCOUNT_TYPE_LIST[2]);
    }

    const { typeMap } = this.state;
    const isDisabled = this.checkIfCanSubmit(this.requiredFields);
    const options = [
      { label: _t('nTx9HsL3ZWXZudv6E23QcK'), type: SUB_ACCOUNT_MAP.spot },
      { label: _t('udP6AeMzbwGgMxwKHwWiuN'), type: SUB_ACCOUNT_MAP.margin },
      { label: _t('39RMYLaRtYHsAF6MPqNcuq'), type: SUB_ACCOUNT_MAP.futures },
      { label: _t('6e9844564e1f4000afd0'), type: SUB_ACCOUNT_MAP.option },
    ].filter((item) => currentTypePermission.includes(item.type.toLowerCase()));

    const custodyList = (oesCustodyList || []).map((item) => ({
      label: item.name,
      value: item.code,
    }));

    return (
      <StyledDialog
        data-inspector="account_sub_create_form"
        open={visible}
        title={_t('subaccount.opt.create')}
        style={{ margin: 24, maxWidth: '520px' }}
        onCancel={onCancel}
        destroyOnClose
        onOk={this.handleOk}
        cancelText={_t('cancel')}
        okText={_t('save')}
        okButtonProps={{
          loading: rest.loading,
          disabled: isDisabled,
        }}
        {...rest}
      >
        <AlertCnt>
          <Alert type="warning" showIcon={true} description={_t('subaccount.warning.create')} />
        </AlertCnt>
        <React.Fragment>
          {/* 账号类型 */}
          {typeListFromMultiSiteConfig.length > 0 && (
            <FormItem
              label={_t('cah8JTdgSDNee6kmzusjwx')}
              name="type"
              rules={[]}
              initialValue={String(typeListFromMultiSiteConfig[0].value)}
            >
              <AccountSelect
                classNames={{ dropdownContainer: 'sub-account-select-dropdown' }}
                listItemHeight={96}
                dropdownHeight={270}
                size="xlarge"
                options={typeListFromMultiSiteConfig}
                fullWidth
              />
            </FormItem>
          )}
          {/* 三方资管子账号才选择资金托管机构 */}
          {isOES && !!custodyList.length && (
            <FormItem
              label={_t('118c5a6abd014800a671')}
              name="custodyCode"
              rules={[]}
              initialValue={String(custodyList[0].value)}
            >
              <AccountSelect size="xlarge" options={custodyList} fullWidth />
            </FormItem>
          )}

          <TipWrapper>
            <span>{_t('koRMHoMMvFsSDvZwWwjHeB')}</span>
            <Tooltip placement="top-start" title={<span>{_t('ohEMWBFynxTqHmfv1EsY9y')}</span>}>
              <TipsImg src={Tips} alt="star" />
            </Tooltip>
          </TipWrapper>
          {options.map((i) => {
            return this.hasPermission(i.type, type) ? (
              <Container key={i.type}>
                <FormItem name={i.type} valuePropName="checked">
                  <Checkbox
                    disabled={isNormalType && count?.[i.type] === 0}
                    onChange={(e) => this.handleChange(e, i.type)}
                  >
                    {i.label}
                  </Checkbox>
                </FormItem>
                {isNormalType && (
                  <LabelSpan>
                    {_t('gdyWy9jXTsQD52uQsM7QE5', {
                      num: typeMap?.[i.type] > 0 ? typeMap?.[i.type] + '' : '0',
                    })}
                  </LabelSpan>
                )}
              </Container>
            ) : null;
          })}

          <Box />
          <FormWrapper>
            <FormItem
              label={_t('subaccount.prop.name')}
              name="subName"
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.accountNameValidator,
                },
              ]}
              validateFirst={true}
              validateTrigger={['onSubmit', 'onBlur']}
            >
              <ExtendInput
                inputProps={{ maxLength: 24 }}
                placeholder={_t('subaccount.rule.name')}
                autoComplete="off"
                size="xlarge"
              />
            </FormItem>
          </FormWrapper>

          <FormWrapper>
            <FormItem
              label={_t('sub.login.password')}
              name="password"
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.passwordValidator,
                },
              ]}
              validateTrigger={['onSubmit', 'onBlur']}
            >
              <Input
                allowClear={true}
                type="password"
                inputProps={{ maxLength: 32 }}
                placeholder={_t('pwd.placeholder')}
                autoComplete="new-password"
                size="xlarge"
              />
            </FormItem>
          </FormWrapper>
          <FormItem
            label={_t('remark')}
            name="remarks"
            rules={[
              {
                max: 24,
                message: _t('subaccount.rule.remark'),
              },
            ]}
          >
            <ExtendInput
              inputProps={{ maxLength: 24 }}
              placeholder={_t('subaccount.rule.remark')}
              autoComplete="off"
              size="xlarge"
            />
          </FormItem>
          {hasOESSubType && (
            <Global
              styles={`
            .sub-account-select-dropdown {
              & > div > div > div {
                height: 270px !important;
              }
              .KuxSelect-optionItem {
                padding: 0 16px !important;
                &:nth-of-type(1) {
                  height: 78px !important;
                }
                &:nth-of-type(2) {
                  top: 78px !important;
                }
                &:nth-of-type(3) {
                  top: 174px !important;
                }
              }
            }
          `}
            />
          )}
        </React.Fragment>
      </StyledDialog>
    );
  }
}

export default withMultiSiteConfig(ModalAdd);
