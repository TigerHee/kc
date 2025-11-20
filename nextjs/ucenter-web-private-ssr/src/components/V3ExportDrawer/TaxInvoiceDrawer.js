/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { Button, Drawer, Form, RangePicker, useSnackbar } from '@kux/mui';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import { getExportRemainTimesTH, requestDownloadInvoice } from 'src/services/download';
import { _t, _tHTML } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import AlertInfo from './Alert';

const Bold = styled.b``;

const { FormItem, useForm } = Form;

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
    height: 25px;
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

const InfoBoxAlert = styled.div`
  margin-top: 7px;
`;

const StyledRangePicker = styled(RangePicker)`
  width: 100%;
  text-align: left;
  .KuxPicker-input {
    width: 88px;
  }
  .KuxPicker-suffix {
    position: absolute;
    right: 14px;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .KuxPicker-range-separator {
    justify-content: center;
    width: auto;
    margin: 0 4px !important;
  }
`;

export const getInitTime = () => {
  // 2024年10月16日之前，默认时间是10月1日到昨天，之后是默认是15天的时间
  if (moment().isBefore(moment('2024/10/02').startOf('days'))) {
    return [moment('2024/10/01').startOf('days'), moment('2024/10/01').endOf('days')];
  } else {
    // 昨天
    return [
      moment().subtract(1, 'days').startOf('days'),
      moment().subtract(1, 'days').endOf('days'),
    ];
  }
};

export const disabledDateTH = (current) => {
  // 最小可选择的UTC时间 2024-10-01
  const minDate = moment('2024/10/01').startOf('day');
  // 最大可选择的日期为昨天
  const maxDate = moment().subtract(1, 'days').endOf('day');
  if (current.isAfter(maxDate) || current.isBefore(minDate)) {
    return true;
  }
  return false;
};

export const timeValidator = (rule, value, callback) => {
  // 两次选择的时间间隔
  const diffDays = Math.abs(moment(value[0]).diff(moment(value[1]), 'days'));
  if (diffDays >= tenantConfig.download.taxInvoiceExportTimeLimit) {
    return Promise.reject(
      new Error(
        _t('8b9401f6c5d04000a435', { limit: tenantConfig.download.taxInvoiceExportTimeLimit }),
      ),
    );
  }
  callback();
};

export const autoFormmatPeriod = (period) => {
  const newPeriod = [period[0], period[1].endOf('days')]; // 结束时间是当天的结束时间
  const minDate = moment('2024/10/01').startOf('days');
  const maxDate = moment().subtract(1, 'days').endOf('days');
  console.log('maxDate', maxDate.toLocaleString());
  let [start, end] = newPeriod;
  if (start < minDate) {
    start = minDate;
  }
  if (end > maxDate) {
    end = maxDate;
  }
  return [start, end];
};

export default React.memo(({ isInDrawer = true }) => {
  const [form] = useForm();
  const { validateFields } = form;
  const dispatch = useDispatch();
  const { taxInvoiceDrawerOpen } = useSelector((state) => state.order_meta);
  const { pagination } = useSelector((state) => state.download);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const { message } = useSnackbar();
  const [period, setPeriod] = useState(getInitTime());
  const { user, timeZonesV2 } = useSelector((state) => state.user);
  const [remainTimes, setRemainTimes] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // 获取剩余导出次数
  const getRemainTimes = useCallback(() => {
    getExportRemainTimesTH({ source: 'WEB' })
      .then(({ success, data }) => {
        if (success) {
          setRemainTimes(data?.remainingDownloadNumber ?? 0);
        }
      })
      .catch(() => {
        setRemainTimes(0);
      });
  }, []);

  useEffect(() => {
    if (taxInvoiceDrawerOpen || !isInDrawer) {
      getRemainTimes();
    }
  }, [taxInvoiceDrawerOpen, isInDrawer, getRemainTimes]);

  useEffect(() => {
    dispatch({ type: 'user/pullTimeZonesV2' });
  }, []);

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

  const handleClose = useCallback(() => {
    dispatch({
      type: 'order_meta/update',
      payload: {
        taxInvoiceDrawerOpen: false,
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
      .then(async () => {
        const params = {
          startDate: period[0].valueOf(),
          endDate: period[1].valueOf(),
          source: 'WEB',
          zoneId: userTimeZone?.zoneId,
          downloadCreateTime: moment().valueOf(),
        };
        try {
          setIsExporting(true);
          const { code, data } = await requestDownloadInvoice(params);
          if (code === '200') {
            if (!data?.completeFlag) {
              message.error(_t('6625eaffd2fa4000a54a'));
            } else {
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
              handleClose();
            }
          }
        } catch (e) {
          const { code } = e || {};
          if (code === '230002') {
            message.error(_t('377bbd8141ed4000ab46'));
          } else if (code === '230001') {
            message.error(_t('8b9401f6c5d04000a435', { limit: 15 }));
          } else {
            message.error(_t('i29uUPSDMXVHAFj4sroyVP'));
          }
        } finally {
          setIsExporting(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Content = (
    <>
      <ContentWrapper data-inspector="bill_export_drawer">
        <ContentBody>
          <Form form={form} layout="horizontal">
            <FormItem
              label={_t('time')}
              initialValue={period}
              name="times"
              rules={[{ required: true }, { validator: timeValidator }]}
              validateFirst={true}
              validateTrigger={['onSubmit', 'onBlur']}
            >
              <StyledRangePicker
                size="large"
                disabledDate={disabledDateTH}
                value={period}
                allowClear={false}
                renderExtraFooter={[
                  {
                    code: '1week',
                    label: _t('coin.detail.mute.time.oneweek'),
                    index: 0,
                    range: [
                      moment().subtract(7, 'days').startOf('days'),
                      moment().subtract(1, 'day').endOf('days'),
                    ],
                  },
                ]}
                onChange={(momentList) => {
                  if (momentList?.length === 2) {
                    const newPeriod = autoFormmatPeriod(momentList);
                    setPeriod(newPeriod);
                    form.setFieldsValue({ times: newPeriod });
                  } else {
                    setPeriod(null);
                  }
                }}
              />
            </FormItem>
          </Form>
          <InfoBoxAlert>
            <AlertInfo
              infoList={tenantConfig.download.taxInvoiceDrawAlertInfo(_t, _tHTML, <Bold />)}
            />
          </InfoBoxAlert>
        </ContentBody>
        <ButtonWrapper>
          <Button
            data-testid="export-drawer-submit-th"
            onClick={handleSubmit}
            disabled={remainTimes === '' || remainTimes <= 0 || isPullUserLoading}
            loading={remainTimes === '' || isPullUserLoading || isExporting}
            type="primary"
          >
            {_t('58YYUs8rvykGSp8EjoqLij')}
            {remainTimes === '' ? null : _t('gkycvog7b2Bfta8dRQkyTD', { a: String(remainTimes) })}
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </>
  );

  if (isInDrawer) {
    return taxInvoiceDrawerOpen ? (
      <DrawerStyled
        back={null}
        title={_t('a5c0b1eca5384000ad75')}
        show={taxInvoiceDrawerOpen}
        onClose={handleClose}
      >
        {Content}
      </DrawerStyled>
    ) : null;
  }

  return Content;
});
