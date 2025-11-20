/**
 * Owner: odan.ou@kupotech.com
 */

import styled from '@emotion/styled';
import history from '@kucoin-base/history';
import { Button } from '@kux/mui';
import submittedImg from 'static/legal/submitted.svg';
import { StatusEmpty } from './Components';
import { _t } from './utils';

const BtnWrapper = styled.div`
  margin-top: 40px;
`;

const Submitted = (props) => {
  const { onClose, screen } = props;
  const goHome = () => {
    history.push('/');
  };
  const isSmallScreen = screen === 'Max768';
  return (
    <StatusEmpty
      description={_t('7dFDP9a6pXqGxcqxjBPdxU', '提交成功')}
      subDescription={_t('qNr6YcAjPFcJPqitUH75QF', '您的调证信息已提交成功，我们将尽快回复您')}
      imgSrc={submittedImg}
    >
      <BtnWrapper>
        <Button type="primary" variant="outlined" fullWidth={isSmallScreen} onClick={onClose}>
          {_t('ckydcKSNdoazd6jWmgtHLx', '继续提交')}
        </Button>
        <Button fullWidth={isSmallScreen} style={{ marginLeft: 16 }} onClick={goHome}>
          {_t('7L9dBxFmzvptXni7sokvHP', '返回首页')}
        </Button>
      </BtnWrapper>
    </StatusEmpty>
  );
};

export default Submitted;
