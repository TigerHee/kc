/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { useLocale } from 'hooks/useLocale';
import { MailAuthorize } from 'gbiz-next/mailAuthorize';

import { ICTriangleBottomOutlined } from '@kux/icons';
import { Button, Checkbox, Dialog, Drawer, Form, Radio, useSnackbar, useTheme } from '@kux/mui';
import DateTimeFormat from 'components/common/DateTimeFormat';
import { Link } from 'components/Router';
import { searchToJson } from 'helper';
import { cloneDeep } from 'lodash-es';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportAccountStatementBill,
  getExportQueue,
  getExportRemainTimes,
  postExport,
} from 'services/commonBasis';
import { tenantConfig } from 'src/config/tenant';
import { ACCOUNT_STATEMENT_CODE, ACCOUNT_STATEMENT_MONTHLY } from 'src/constants/download';
import pdfSrc from 'static/download/pdf.svg';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import Alert from './Alert';
import Cascader from './Cascader';
import { ALL_TOP_CODES_MAP } from './config';
import MonthDatePicker, { DayDatePicker, generateMonthPickerDefaultTime } from './MonthDatePicker';
import Record from './Record';
import TimeZoneSelect from './TimeZoneSelect';
import V3TimePicker, { disabledDate, getInitTime } from './V3TimePicker';

const { FormItem, useForm } = Form;
const CheckboxGroup = Checkbox.Group;

const DrawerStyled = styled(Drawer)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    .KuxModalHeader-root {
      height: 56px;
      padding: 0 16px;
      .KuxModalHeader-title {
        font-size: 18px;
      }
      .KuxModalHeader-close {
        top: 14px;
        right: 16px;
        width: 28px;
        height: 28px;
      }
    }
  }
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 480px;
  height: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
const ContentBody = styled.div`
  flex: 1;
  padding: 40px 32px;
  overflow-y: auto;
  .KuxForm-itemHelp {
    height: 24px;
  }
  .KuxCol-col {
    width: 100%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 81px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 20px 32px;
`;

const Checkbox18 = styled.div`
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }
  .KuxCheckbox-checkbox {
    top: 0;
    padding: 1px;
  }
  .KuxCheckbox-inner {
    border-color: ${({ theme }) => theme.colors.icon40};
  }
`;

const SubAccountCheckBoxWrap = styled(Checkbox18)`
  .KuxCheckbox-wrapper {
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.text60};
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
const RadioGroup = styled(Radio.Group)`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
`;

const PdfFile = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
`;

const PdfFileContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
`;

const FileNameLabel = styled.label`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const PdfIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const Radio20 = styled(Radio)`
  margin-right: 16px;
  .KuxRadio-radio {
    margin-right: 8px;
    padding: 1px;
  }
  .KuxRadio-inner {
    width: 18.3px;
    height: 18.3px;
    &::after {
      width: 8.3px;
      height: 8.3px;
      margin-top: -4.15px;
      margin-left: -4.15px;
    }
  }
`;

const SubAccountAccordion = styled.div`
  margin-bottom: 24px;
`;

const SubAccountAccordionHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  padding-bottom: 8px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
`;
const SubAccountAccordionIconWrap = styled.span`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.icon40};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SubAccountAccordionIcon = styled(ICTriangleBottomOutlined)((props) => {
  return {
    transition: 'all 0.3s',
    transform: `rotate(${props.isActive ? '-180deg' : '0deg'})`,
  };
});
const SubAccountAccordionContent = styled.div`
  display: flex;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.divider8};

  .KuxForm-itemHelp {
    display: none;
  }
`;

const InfoBoxAlert = styled.div`
  margin-top: 7px;
`;

const InfoBox = styled.div`
  margin-top: 32px;
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
`;

const ConfirmDialogList = styled.div`
  display: flex;
  flex-direction: column;
`;
const ConfirmDialogItem = styled.div`
  flex: 1;
  margin: 4px 0;
  font-size: 16px;
  span:nth-of-type(1) {
    margin-right: 5px;
    color: ${({ theme }) => theme.colors.text40};
  }
  span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.text};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const ExDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 450px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      max-height: 66.6vh;
      margin: 0 16px;
      overflow: auto;
      .KuxDialog-content {
        flex: 1;
        overflow: auto;
      }
    }
  }
`;

function SubAccountRadioGroup({ onChange, value, options }) {
  return (
    <SubAccountCheckBoxWrap>
      <CheckboxGroup options={options} value={value} onChange={onChange} />
    </SubAccountCheckBoxWrap>
  );
}

const BIZ_TYPE = 'bill_export';

// 判断传入的时间戳是否超过两年，超过返回true,否则为false
export const checkIsOverTwoYears = (timestamp) => {
  // 将时间戳转换为Moment对象
  const date = moment(timestamp);
  // 获取两年前的当前时间
  const twoYearsAgo = moment().subtract(2, 'years');
  // 判断是否超过两年
  return date.isBefore(twoYearsAgo);
};

export default React.memo(({ showRecord = true, isInDrawer = true }) => {
  const fillRef = useRef(null);
  const [form] = useForm();
  const codesValue = Form.useWatch(['codes'], form);
  const subAccountListValue = Form.useWatch(['subAccountList'], form);
  const isAccountStatementMounth = (codesValue || []).some((i) => ACCOUNT_STATEMENT_MONTHLY === i);
  const isAccountStatement = (codesValue || []).some((i) => ACCOUNT_STATEMENT_CODE.includes(i));
  const { setFieldsValue, validateFields } = form;
  const dispatch = useDispatch();
  const { exportDrawerOpen, subUserList } = useSelector((state) => state.order_meta);
  const { pagination } = useSelector((state) => state.download);
  const { user, timeZonesV2 } = useSelector((state) => state.user);

  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const { message } = useSnackbar();
  const { isSub } = user || {};
  useLocale();

  const [remainTimes, setRemainTimes] = useState('');
  const [exportParams, setExportParams] = useState(null);
  const [openCheckRisk, setOpenCheckRisk] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({});
  const [queryCodes, setQueryCodes] = useState([]);
  const theme = useTheme();
  const [subAccountAccordionActive, setSubAccountAccordionActive] = useState(false);

  // 时区文案
  const userTimeZone = useMemo(() => {
    if (timeZonesV2 && user) {
      const zoneItem = timeZonesV2.find((i) => i[0] === user.timeZone);
      if (zoneItem) {
        return {
          zoneCode: zoneItem[0],
          zoneId: zoneItem[2],
        };
      }
      return {};
    }
  }, [timeZonesV2, user]);

  // 获取剩余导出次数
  const getRemainTimes = useCallback(() => {
    getExportRemainTimes().then(({ success, data }) => {
      if (success) {
        setRemainTimes(data);
      }
    });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'order_meta/update',
      payload: {
        exportDrawerOpen: false,
      },
    });
  }, []);

  const handleSubmit = async () => {
    saTrackForBiz({}, ['Export', 'CreateTask']);
    if (!userTimeZone?.zoneCode) {
      message.error(_t('otc.ads.onlin.time.placeholder'));
      return;
    }
    validateFields()
      .then(async (values) => {
        const { times, subAccount, codes, fileType, subAccountList = [] } = values;
        const paramsCodes = codes.length ? codes : [];
        const params = {
          zoneId: userTimeZone?.zoneId,
        };
        const bizTypes = paramsCodes.map((item) => {
          return {
            code: item,
            name: ALL_TOP_CODES_MAP[item],
          };
        });
        // 月结账单
        if (isAccountStatementMounth) {
          params.exportDate = moment(times || undefined)
            .endOf('month')
            .format('YYYY-MM-DD');
        } else if (isAccountStatement) {
          params.exportDate = moment(times || undefined).format('YYYY-MM-DD');
        } else if (Array.isArray(times)) {
          params.exportStartDate = +times[0];
          params.exportEndDate = +times[1];
        }
        // 是账户结单
        if (isAccountStatement) {
          params.isDaily = isAccountStatementMounth ? '0' : '1'; // 0月结 1日结
          params.subIdlistStr = subAccountList.join(',');
        } else {
          params.fileType = fileType;
          params.bizTypes = bizTypes;
          params.subAccount = !!subAccount;
        }
        try {
          let isOverTwoYears = false;
          let data = 0;
          // 只有不是账户结单，才判断排队情况
          if (!isAccountStatement) {
            isOverTwoYears = checkIsOverTwoYears(params.exportStartDate);
            // 导出前查询排队情况
            const res = await getExportQueue();
            data = res.data;
            // 导出开始时间超过2年 且 排队数量超过350，导出失败
            if (isOverTwoYears && +data > 350) {
              setConfirmDialogConfig({
                open: true,
                onCancel: () => {
                  setConfirmDialogConfig((i) => ({
                    ...i,
                    open: false,
                  }));
                },
                okText: null,
                cancelText: _t('cancel'),
                title: _t('31Ejnf1oFxvjWoZuWxuwCd'),
                text: _t('6WxcRUE7ywq5RzajAHbeA7'),
              });
              return;
            }
          }
          // 导出开始时间未超过2年 或 排队数量小于等于350，二次确认
          setConfirmDialogConfig({
            open: true,
            onCancel: () => {
              setConfirmDialogConfig((i) => ({
                ...i,
                open: false,
              }));
            },
            onOk: () => {
              setConfirmDialogConfig((i) => ({
                ...i,
                open: false,
              }));
              setExportParams(params);
              setOpenCheckRisk(true);
            },
            okText: _t('confirm'),
            cancelText: _t('cancel'),
            title: _t('4hDyMS1S4JvBRuKnLmS9ku'),
            text: (
              <ConfirmDialogList>
                <ConfirmDialogItem>
                  <span>{_t('dKHDXCHjx5aNp63kkRkQ6c')}</span>
                  <span>{bizTypes.map((i) => i.name).join(',')}</span>
                </ConfirmDialogItem>
                <ConfirmDialogItem>
                  <span>{_t('ebaVxShPzYuPbA69rM7dMC')}</span>
                  <span>
                    {isAccountStatement ? (
                      params?.exportDate && (
                        <DateTimeFormat
                          hideTime
                          options={
                            isAccountStatementMounth
                              ? {
                                year: '2-digit',
                                month: '2-digit',
                                day: undefined,
                                hour: undefined,
                                minute: undefined,
                                second: undefined,
                              }
                              : {
                                year: '2-digit',
                                month: '2-digit',
                                day: '2-digit',
                                hour: undefined,
                                minute: undefined,
                                second: undefined,
                              }
                          }
                        >
                          {moment(params?.exportDate)}
                        </DateTimeFormat>
                      )
                    ) : (
                      <>
                        <DateTimeFormat hideTime>{params?.exportStartDate}</DateTimeFormat> -{' '}
                        <DateTimeFormat hideTime>{params?.exportEndDate}</DateTimeFormat>
                      </>
                    )}
                  </span>
                </ConfirmDialogItem>
                <ConfirmDialogItem>
                  <span>{_t('ehxRH8iHMnBRngcnJLnZf2')}</span>
                  <span>
                    {timeZonesV2.find((i) => i[0] === userTimeZone.zoneCode)?.[1] ?? '--'}
                  </span>
                </ConfirmDialogItem>
                <ConfirmDialogItem>
                  <span>{_t('9BBvVC6bUsDRVPXTatSHoQ')}</span>
                  <span>
                    {!isOverTwoYears ? _t('j6c3B39ay3cz7sme1dPX6a') : null}
                    {isOverTwoYears && +data < 50 ? _t('2P5t8hjih83aF2TtBamWFL') : null}
                    {isOverTwoYears && +data >= 50 && +data <= 350
                      ? _t('gf6LMtS7HdHLmEgcAHXFn9')
                      : null}
                  </span>
                </ConfirmDialogItem>
              </ConfirmDialogList>
            ),
          });
        } catch (e) {
          message.error(_t('i29uUPSDMXVHAFj4sroyVP'));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleExport = () => {
    const params = cloneDeep(exportParams);
    setExportParams(null);
    setOpenCheckRisk(false);

    (isAccountStatement ? exportAccountStatementBill(params) : postExport(params))
      .then((res) => {
        message.success(_t('ceQEke9nGJG5xSpEfAfUwY'));
        // 导出账单页面，导出成功时埋点
        !isInDrawer && trackClick(['Successful', '1']);
        getRemainTimes();
        dispatch({
          type: 'download/query',
          payload: {
            current: 1,
            pageSize: pagination.pageSize,
          },
        });

        if (!showRecord) {
          handleClose();
        }
      })
      .catch((err) => {
        message.error(_t('i29uUPSDMXVHAFj4sroyVP'));
      });
  };

  useEffect(() => {
    /**
     * 根据query参数回填下载信息
     * openexport 是否自动打开抽屉 1打开
     * fileType 导出文件类型 xlsx ｜ csv
     * subAccount 是否包含子账号 1包含
     * codes 默认选中的业务类型 用,拼接
     * times 选中时间 用,拼接
     * ?openexport=1&fileType=xlsx&subAccount=1&codes=INOUT-RECHARGE,INOUT-WITHDRAW&times=1691424000000,1699372800000
     */
    try {
      if (isInDrawer && !fillRef.current) {
        fillRef.current = 1;
        const query = searchToJson();
        const { openexport, fileType = 'csv', subAccount = '', times = '', codes = '' } = query;
        if (openexport === '1') {
          dispatch({
            type: 'order_meta/update',
            payload: {
              exportDrawerOpen: true,
            },
          });

          if (codes) {
            setQueryCodes(codes.split(','));
          }

          const val = {
            fileType,
            subAccount: subAccount === '1',
          };

          if (times) {
            const arr = times.split(',').map((i) => Number(i));
            if (arr[1] - arr[0] > 0) {
              val.times = [moment(arr[0]).startOf('days'), moment(arr[1]).endOf('days')];
            }
          }

          setFieldsValue(val);
        }
      }
    } catch (error) {
      console.log('error === ', error);
    }
  }, [dispatch, isInDrawer, setFieldsValue]);

  useEffect(() => {
    if (exportDrawerOpen || !isInDrawer) {
      getRemainTimes();
    }
  }, [exportDrawerOpen, isInDrawer, getRemainTimes]);

  useEffect(() => {
    dispatch({
      type: 'user/pullTimeZonesV2',
    });

    if (!isSub) {
      dispatch({
        type: 'order_meta/fetchSubUserList',
      });
    }
  }, [dispatch, isSub]);

  useEffect(() => {
    if (subUserList.length && !isSub) {
      setSubAccountAccordionActive(true);
    } else {
      setSubAccountAccordionActive(false);
    }
  }, [subUserList, isSub]);

  const Content = (
    <>
      <ContentWrapper data-inspector="bill_export_drawer">
        <ContentBody>
          <Form form={form} layout="horizontal">
            <FormItem
              name="codes"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Cascader setFieldsValue={setFieldsValue} queryCodes={queryCodes} />
            </FormItem>
            <FormItem
              label={_t('time')}
              name="times"
              initialValue={
                isAccountStatementMounth
                  ? generateMonthPickerDefaultTime()
                  : getInitTime(isAccountStatement)
              }
              rules={[]}
            >
              {isAccountStatementMounth ? (
                <MonthDatePicker />
              ) : isAccountStatement ? (
                <DayDatePicker />
              ) : (
                <V3TimePicker
                  disablePortal={false}
                  placeholder={_t('time')}
                  size="xlarge"
                  disabledDate={disabledDate}
                />
              )}
            </FormItem>
            <FormItem>
              <TimeZoneSelect
                timeZone={user?.timeZone || ''}
                timeZones={timeZonesV2}
                disabled={isAccountStatement}
              />
            </FormItem>

            {!isSub ? (
              !isAccountStatement ? (
                <FormItem name="subAccount" valuePropName="checked">
                  <Checkbox18>
                    <Checkbox size="small">{_t('sj4dFVdHkFVfDqcWU6gizD')}</Checkbox>
                  </Checkbox18>
                </FormItem>
              ) : (
                <SubAccountAccordion>
                  <SubAccountAccordionHeader
                    onClick={() => {
                      // 有子账号才支持切换
                      if (subUserList.length) {
                        setSubAccountAccordionActive((i) => !i);
                      }
                    }}
                  >
                    <SubAccountAccordionIconWrap>
                      <SubAccountAccordionIcon isActive={subAccountAccordionActive} size={20} />
                    </SubAccountAccordionIconWrap>
                    <span>
                      {_t('0ea8a94d8a704000ad6c', {
                        count: (subAccountListValue || []).length,
                      })}
                    </span>
                  </SubAccountAccordionHeader>
                  {subAccountAccordionActive && subUserList.length ? (
                    <SubAccountAccordionContent>
                      <FormItem name="subAccountList">
                        <SubAccountRadioGroup
                          options={subUserList.map((i) => ({
                            label: i.subName,
                            value: i.userId,
                          }))}
                        />
                      </FormItem>
                    </SubAccountAccordionContent>
                  ) : null}
                </SubAccountAccordion>
              )
            ) : null}

            {isAccountStatement ? (
              <FormItem name="fileType" initialValue={'pdf'}>
                <PdfFile>
                  <FileNameLabel>{_t('bill.export.file.format')}</FileNameLabel>
                  <PdfFileContent>
                    <PdfIcon src={pdfSrc} alt="pdf" />
                    <span>.pdf</span>
                  </PdfFileContent>
                </PdfFile>
              </FormItem>
            ) : (
              <FormItem name="fileType" initialValue={'csv'}>
                <RadioGroup>
                  <FileNameLabel>{_t('bill.export.file.format')}</FileNameLabel>
                  <Radio20 value={'xlsx'} size="small">
                    .xlsx
                  </Radio20>
                  <Radio20 value={'csv'} size="small">
                    .csv
                  </Radio20>
                </RadioGroup>
              </FormItem>
            )}
          </Form>
          <InfoBoxAlert>
            <Alert
              showIdx={false}
              infoList={
                isAccountStatement
                  ? tenantConfig.download.accountStatementAlertInfo(_t)
                  : tenantConfig.download.normalDrawAlertInfo(_t)
              }
            />
          </InfoBoxAlert>
          {!isInDrawer && (
            <InfoBox>
              <LinkWrapper>
                <Link to="/order/trade">{_t('selfService.billExport.link')}</Link>
              </LinkWrapper>
            </InfoBox>
          )}
          {showRecord ? (
            <InfoBox>
              <Record isInDrawer={isInDrawer} />
            </InfoBox>
          ) : null}
        </ContentBody>
        <ButtonWrapper>
          <Button
            data-testid="export-drawer-submit"
            onClick={handleSubmit}
            disabled={remainTimes === '' || remainTimes <= 0}
            loading={remainTimes === '' || isPullUserLoading}
            type="primary"
          >
            {_t('58YYUs8rvykGSp8EjoqLij')}
            {remainTimes === ''
              ? null
              : _t('gkycvog7b2Bfta8dRQkyTD', {
                a: String(remainTimes),
              })}
          </Button>
        </ButtonWrapper>
      </ContentWrapper>

      <MailAuthorize
        theme={theme.currentTheme}
        bizType={BIZ_TYPE}
        onSuccess={handleExport}
        open={openCheckRisk}
        checkRiskParams={exportParams}
      />
      <ExDialog {...confirmDialogConfig}>{confirmDialogConfig.text}</ExDialog>
    </>
  );

  if (isInDrawer) {
    return exportDrawerOpen ? (
      <DrawerStyled
        back={null}
        title={_t('aD6BEuUSP4sWWr8dZWTmbS')}
        show={exportDrawerOpen}
        onClose={handleClose}
      >
        {Content}
      </DrawerStyled>
    ) : null;
  }

  return Content;
});
