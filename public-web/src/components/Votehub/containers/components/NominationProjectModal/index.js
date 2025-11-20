/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Form, Input, Select, useSnackbar } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { find, map } from 'lodash';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import Modal from '../../../components/Modal';
import { useResponsiveSize } from '../../../hooks';
import { ContentWrapper, FooterWrapper } from './styledComponents';

const { FormItem, useForm } = Form;

const NominationProjectModal = () => {
  const nominationModal = useSelector((state) => state.votehub.nominationModal);
  const chainList = useSelector((state) => state.votehub.chainList, shallowEqual);
  const nominationVotesNum = useSelector((state) => state.votehub.nominationVotesNum);
  const votesNum = useSelector((state) => state.votehub.votesNum);
  const loading = useSelector((state) => state.loading.effects['votehub/postCreateProject']);

  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const [form] = useForm();
  const size = useResponsiveSize();
  const { message } = useSnackbar();

  const handleClose = useCallback(() => {
    form.resetFields();
    dispatch({
      type: 'votehub/update',
      payload: {
        nominationModal: false,
      },
    });
  }, [dispatch, form]);

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        const data = await dispatch({
          type: 'votehub/postCreateProject',
          payload: {
            ...values,
          },
        });

        if (data) {
          form.resetFields();
          message.success(_t('cXjrRseGVFjdZX39cHQUUx'));
          dispatch({
            type: 'votehub/update',
            payload: {
              nominationModal: false,
            },
          });
        }
      })
      .catch((err) => {
        console.log('vote error:', err);
      });
  }, [dispatch, form, message]);

  const handleTaskModal = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        nominationModal: false,
        taskModal: true,
      },
    });
  }, [dispatch]);

  const chainOptions = useMemo(() => {
    return map(chainList, (item) => ({
      label: item.name,
      value: item.name,
    }));
  }, [chainList]);

  const notEnabled = useMemo(() => {
    return nominationVotesNum > votesNum;
  }, [nominationVotesNum, votesNum]);

  const Footer = useMemo(() => {
    return (
      <FooterWrapper>
        <div className="ticketWrapper">
          <span className="needNum">
            {_tHTML('tmqm7FUQxk7HFyyNk2ipSm', {
              num: +nominationVotesNum
                ? numberFormat({ lang: currentLang, number: nominationVotesNum })
                : '0',
            })}
          </span>
          <span className={`owenNum ${notEnabled ? 'complementary' : ''}`}>
            {notEnabled
              ? `(${_t('9jfwpLVHz6w8gPWMJRYAtZ')})`
              : `(${_t('aJ7JSH3EECpnZGZjyQZiFg', {
                  num: +votesNum ? numberFormat({ lang: currentLang, number: votesNum }) : '0',
                })})`}
          </span>
        </div>
        <div className="btnWrapper">
          <Button
            variant={size === 'sm' ? 'contained' : 'text'}
            type="default"
            onClick={handleClose}
          >
            {_t('cancel')}
          </Button>
          {notEnabled ? (
            <Button onClick={handleTaskModal}>{_t('mc4dFThgVNWeUNRRhTdPYo')}</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              {_t('submit')}
            </Button>
          )}
        </div>
      </FooterWrapper>
    );
  }, [
    nominationVotesNum,
    votesNum,
    size,
    notEnabled,
    currentLang,
    loading,
    handleClose,
    handleTaskModal,
    handleSubmit,
  ]);

  return (
    <Modal
      title={_t('9i1JnRs42M3actX2uhDUC5')}
      open={nominationModal}
      onClose={handleClose}
      onCancel={handleClose}
      footer={Footer}
      size="medium"
    >
      <ContentWrapper>
        <Form form={form}>
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('currency');
                  if (value === '') {
                    callback(_t('form.required'));
                  } else if (value?.length > 24) {
                    callback(_t('eTTrp5LDS7s5HxQ8Sh9nST', { num: '24' }));
                  } else {
                    callback();
                  }
                },
              },
            ]}
            name="currency"
            label={_t('rBEencvQCSQRSicyf9ez1T')}
            validateTrigger={['onInput']}
          >
            <Input
              placeholder={_t('5qeRXvEKmkAGnMvY5St6jR')}
              className="currency"
              size="xlarge"
              labelProps={{ shrink: true }}
              disabled={notEnabled}
            />
          </FormItem>
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('project');
                  // 不能大于24个字符
                  if (value === '') {
                    callback(_t('form.required'));
                  } else if (value?.length > 64) {
                    callback(_t('eTTrp5LDS7s5HxQ8Sh9nST', { num: '64' }));
                  } else {
                    callback();
                  }
                },
              },
            ]}
            name="project"
            validateTrigger={['onInput']}
            label={_t('mGF5aMZPByw1mi1sCnj19V')}
          >
            <Input
              placeholder={_t('g7Fa9SwZ6TgxpXukDrwB2A')}
              className="project"
              size="xlarge"
              labelProps={{ shrink: true }}
              disabled={notEnabled}
            />
          </FormItem>
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('chainType');
                  if (value === '') {
                    callback(_t('form.required'));
                  } else {
                    callback();
                  }
                },
              },
            ]}
            initialValue={chainList?.[0]?.name}
            name="chainType"
            validateTrigger={['onChange']}
            label={_t('6Sceun3hwqwtsdGUVh334j')}
          >
            <Select
              className="select-item"
              options={chainOptions}
              size="xlarge"
              labelProps={{ shrink: true }}
              disabled={notEnabled}
            />
          </FormItem>
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('contractAddress');
                  const chainType = form.getFieldValue('chainType');
                  const chainItem = find(chainList, { name: chainType }) || {};
                  if (value === '') {
                    callback(_t('form.required'));
                  } else if (chainItem?.lengthLimit && value?.length > +chainItem?.lengthLimit) {
                    callback(_t('eTTrp5LDS7s5HxQ8Sh9nST', { num: chainItem?.lengthLimit }));
                  } else {
                    callback();
                  }
                },
              },
            ]}
            name="contractAddress"
            validateTrigger={['onInput']}
            label={_t('j5E6q9G61wa7UoMg539G4v')}
          >
            <Input
              placeholder={_t('nibLSwizKVXpQdUf73CzaQ')}
              className="contractAddress"
              size="xlarge"
              labelProps={{ shrink: true }}
              disabled={notEnabled}
            />
          </FormItem>
        </Form>
      </ContentWrapper>
    </Modal>
  );
};

export default memo(NominationProjectModal);
