import { TermContent } from '../../components/TermContent';
import { Back } from '../../components/Back';
import { useLang } from '../../hookTool';
import styles from './index.module.scss';
import commonStyles from '../index.module.scss';
import { useSignupStore } from '../model';

const Agreement = (props) => {
  const {
    fromDrawer,
    forgetLeft,
    // 是否展示 forgetLeft 布局，为了向前的兼容性，默认为 true
    isShowForgetLeft = true,
    onBack,
    fromThirdPartySimpleSignup,
    fromBindThirdPartyAccount,
    ...rest
  } = props;

  const { t } = useLang();
  const prevStepList = useSignupStore((state) => state.prevStepList);

  return (
    <>
      {/* 有历史记录 或者 三方极简注册 或者 三方绑定 */}
      {(prevStepList?.length || fromBindThirdPartyAccount || fromThirdPartySimpleSignup) && (
        <Back onBack={onBack} />
      )}
      <TermContent
        {...rest}
        buttonText={t('cc522478ba2a4800a6e6')}
        title={<h2 className={styles.agreementTitle}>{t('481e4f8f2dc04800a7cd')}</h2>}
        extra={
          isShowForgetLeft && forgetLeft ? <div className={commonStyles.alreadyHasCount}>{forgetLeft}</div> : null
        }
      />
    </>
  );
};

export default Agreement;
