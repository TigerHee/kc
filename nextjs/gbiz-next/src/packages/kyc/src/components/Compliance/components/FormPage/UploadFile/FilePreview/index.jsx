/**
 * Owner: tiger@kupotech.com
 */
import useLang from 'packages/kyc/src/hookTool/useLang';
import { Wrapper } from './style';

export default () => {
  const { _t } = useLang();

  return (
    <Wrapper>
      <div className="content">
        <h5 className="fileTitle">{_t('fe2964baa1404800a252')}</h5>
        <div className="lineBox">
          <div className="line line1"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </Wrapper>
  );
};
