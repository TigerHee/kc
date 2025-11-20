import { Button, Checkbox, CheckboxGroup, Empty, Form, Modal, toast } from '@kux/design';
import { ArrowRightIcon, NoviceGuideIcon } from '@kux/iconpack';
import classNames from 'classnames';
import { isEqual } from 'lodash-es';
import { useEffect, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'src/tools/i18n';
import { RESET_ITEMS, SELECT_ITEM_INFOS, SELECT_ITEM_LIST } from '../../constants';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';
import toContactSupport from '../../utils/toContactSupport';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

export default function SelectItems({ list, loading, onNext }) {
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const [form] = Form.useForm();
  const selectedItems = Form.useWatch('selectedItems', form);
  const [modalOpen, setModalOpen] = useState(false);

  // 四项全有并且除了交易密码之外的都勾选的话，不能继续走流程，需要走客服工单
  const contactCustomer =
    selectedItems &&
    selectedItems.includes(RESET_ITEMS.EMAIL) &&
    selectedItems.includes(RESET_ITEMS.PHONE) &&
    selectedItems.includes(RESET_ITEMS.G2FA) &&
    isEqual(
      list.map((item) => item.id),
      SELECT_ITEM_LIST,
    );

  const resetEmailOrPhone =
    selectedItems &&
    (selectedItems.includes(RESET_ITEMS.EMAIL) || selectedItems.includes(RESET_ITEMS.PHONE));

  const handleClick = (value) => {
    selectedItems.includes(value)
      ? form.setFieldsValue({ selectedItems: selectedItems.filter((item) => item !== value) })
      : form.setFieldsValue({ selectedItems: [...selectedItems, value] });
  };

  const handleIntroductionClick = () => {
    if (tenantConfig.resetSecurity.supportBot) {
      // 这里不是走客服工单，而是通过 sdk 调起客服机器人
      if (typeof window.supportBotEmbed?.open === 'function') {
        window.supportBotEmbed.open();
      } else {
        toast.error('Bot is not available now');
      }
    } else {
      // 不支持 sdk 的降级到跳转页面
      window.open(tenantConfig.resetSecurity.notSupportBotUrl, '_blank');
    }
  };

  const handleConfirm = () => {
    if (contactCustomer) {
      toContactSupport();
    } else {
      setModalOpen(false);
      onNext({
        items: selectedItems,
        noEmail: !list.find((item) => item.id === RESET_ITEMS.EMAIL),
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({ selectedItems: [] });
  }, []);

  return (
    <div className={classNames(commonStyles.container, styles.container)}>
      <div className={commonStyles.header}>{_t('ca1ea49cfb954800aedd')}</div>
      <Form form={form} className={styles.formWrapper}>
        <div className={styles.desc}>{_t('ed9bd92c73b64800adae')}</div>
        <Form.FormItem name="selectedItems">
          <CheckboxGroup
            onChange={(value) => {
              form.setFieldsValue({ selectedItems: value });
            }}
          >
            {list.map(({ id, address }) => {
              const item = SELECT_ITEM_INFOS[id];
              const { key, title, icon } = item;
              return (
                <div key={key} className={styles.item} onClick={() => handleClick(key)}>
                  {icon()}
                  <div className={styles.itemContent}>
                    <div>{title()}</div>
                    {address && <div>{address}</div>}
                  </div>
                  <Checkbox value={key} />
                </div>
              );
            })}
          </CheckboxGroup>
        </Form.FormItem>
      </Form>
      <div className={styles.footer}>
        <div className={styles.introduction} onClick={handleIntroductionClick}>
          <span>
            <NoviceGuideIcon size="small" />
            {_t('ecc17ef5bcbc4000a34a')}
          </span>
          <ArrowRightIcon width={16} />
        </div>
        <Button
          type="primary"
          size="large"
          disabled={!selectedItems?.length}
          fullWidth
          loading={loading}
          onClick={() => setModalOpen(true)}
        >
          {_t('40709b77da924000a07a')}
        </Button>
      </div>
      <Modal
        isOpen={modalOpen}
        title={null}
        footerDirection="vertical"
        className={styles.confirmDialog}
        mobileTransform
        okText={contactCustomer ? _t('4925cb44868a4000aa9c') : _t('iECAJ24wQyPUCR8nUqw6Kp')}
        cancelText={contactCustomer ? null : _t('7d29f673a5d64800a09d')}
        cancelButtonType="text"
        onOk={handleConfirm}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        <Empty
          name="warn"
          size="small"
          title={contactCustomer ? _t('693c151f4b124000a788') : _t('beec19e0520e4800accb')}
          description={
            contactCustomer ? (
              _t('047d637f19064800a4ce')
            ) : (
              <div>
                {resetEmailOrPhone ? (
                  <>
                    <div>1. {_t('7155a8b1f6244000ae31')}</div>
                    <div style={{ marginTop: isH5 ? 8 : 16 }}>2. {_t('db835c3ef17d4000aeb5')}</div>
                  </>
                ) : (
                  <div>{_t('7155a8b1f6244000ae31')}</div>
                )}
              </div>
            )
          }
        />
      </Modal>
    </div>
  );
}
