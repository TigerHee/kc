/**
 * Owner: odan.ou@kupotech.com
 */

import { useCallback, useState } from 'react';
import LegalForm from './LegalForm';

const StepThree = (props) => {
  const { token, onEnd } = props;
  const [status, setStatus] = useState();
  const onChange = useCallback((val) => {
    setStatus(val);
  }, []);

  const params = {
    status,
    onChange,
    token,
    onEnd,
  };

  return <LegalForm {...params} />;
};

export default StepThree;
