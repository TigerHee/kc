/**
 * Owner: sean.shi@kupotech.com
 * 只给清退站使用
 */
import { Button, Empty } from '@kux/design';
import addLangToPath from 'tools/addLangToPath';
import useLang from '../../hooks/useLang';
import styles from './styles.module.scss';
import { getSiteConfig } from 'kc-next/boot';

export default ({ onCancel }) => {
  const { t } = useLang();

  const gotoCustomerService = () => {
    const siteConfig =getSiteConfig();
    // 跳转到客服链接
    window.open(
      // 申领站没有部署客服系统，仍然用主站域名
      addLangToPath(
        `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
      ),
      '_blank',
    );
  };

  return (
    <>
      <div className={styles.errorContainer}>
        <Empty name="warn" size="small" />
        <div className={styles.errorTitle}>{t('353cf88720354000a604')}</div>
        <div className={styles.errorContent}>{t('2eff54f6d6ef4000af03')}</div>
      </div>
      <div className={styles.buttonWrap}>
        <Button type="primary" data-testid="error-dialog-confirm" fullWidth onClick={gotoCustomerService}>
          {t('0f6b1e7dedc54000a647')}
        </Button>
        <Button data-testid="error-dialog-cancel" fullWidth onClick={onCancel}>
          {t('1ffb610866f64000ae3d')}
        </Button>
      </div>
    </>
  );
};
