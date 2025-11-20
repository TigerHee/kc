/**
 * Owner: tiger@kupotech.com
 */
import { Spin } from '@kux/mui';
import classnames from 'classnames';
import Back from 'components/Account/Kyc/common/components/Back';
import FAQ from 'components/Account/Kyc/common/components/FAQ';
import { isFunction } from 'lodash-es';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AU_KYB_LEVEL_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import { Container, Header, Layout } from '../styled';
import StatusContent from './StatusContent';

/**
 * isInMigrate 是否迁移页面
 */
export default ({ onBack, isInMigrate }) => {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) =>
      state.loading.effects['kyc_au/getKyb1'] ||
      state.loading.effects['kyc_au/getKyb2'] ||
      state.loading.effects['kyc_au/getKyb3'] ||
      false,
  );
  const kyb1 = useSelector((state) => state.kyc_au.kyb1);

  useEffect(() => {
    dispatch({
      type: 'kyc_au/getKyb1',
      payload: { type: isInMigrate ? AU_KYB_LEVEL_ENUM.KYB1_MIGRATE : AU_KYB_LEVEL_ENUM.KYB1 },
    });
    if (!isInMigrate) {
      dispatch({ type: 'kyc_au/getKyb2' });
      dispatch({ type: 'kyc_au/getKyb3' });
    }
    if (isInMigrate) {
      dispatch({ type: 'kyc_au/getKybCountryList' });
    }
  }, [isInMigrate]);

  const isCannotBack = [KYC_STATUS_ENUM.VERIFYING, KYC_STATUS_ENUM.VERIFIED].includes(kyb1.status);

  return (
    <Spin spinning={loading}>
      <Container>
        <div className="backBox">
          <div className="backContent">
            {isFunction(onBack) && !isCannotBack ? (
              <Back hasMarginLeft={false} onClick={onBack} />
            ) : null}
          </div>
        </div>

        <Header>
          <div
            className={classnames({
              headerContent: true,
              maxWidth640: isInMigrate,
            })}
          >
            {isInMigrate ? _t('0dc0ba12f8f44000a363') : _t('kyc.certification.mechanism')}
          </div>
        </Header>

        <Layout
          className={classnames({
            maxWidth: isInMigrate,
          })}
        >
          <div
            className={classnames({
              layoutContent: true,
              maxWidth640: isInMigrate,
            })}
          >
            {!loading && <StatusContent isInMigrate={isInMigrate} />}
            <FAQ>
              <FAQ.Item
                title={_t('83ef577033794000a487')}
                description={_t('43ad7668dc0f4000a769')}
                defaultOpen
              />
              <FAQ.Item
                title={_t('86e28cd335a84000abc8')}
                description={_t('784bac090e394000addd')}
                defaultOpen
              />
            </FAQ>
          </div>
        </Layout>
      </Container>
    </Spin>
  );
};
