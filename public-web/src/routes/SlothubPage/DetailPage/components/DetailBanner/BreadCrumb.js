/*
 * Owner: harry.lai@kupotech.com
 */
import { useHistory } from 'react-router-dom';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { _t } from 'src/tools/i18n';
import { BreadCrumbWrap } from './styled';

const BreadCrumb = () => {
  const { isH5 } = useDeviceHelper();
  const history = useHistory();

  if (isH5) return null;

  const backToHome = () => {
    history.push('/gemslot');
  };

  return (
    <BreadCrumbWrap>
      <span className="home" onClick={backToHome} role="button" tabIndex="0">
        {_t('1c0bd8c038b54800a301')}
      </span>
      <span className="gap">{'>'}</span>
      <span className="highlight">{_t('49c1bf0d46d14000ad56')}</span>
    </BreadCrumbWrap>
  );
};

export default BreadCrumb;
