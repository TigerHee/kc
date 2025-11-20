/**
 * Owner: odan.ou@kupotech.com
 */

import styled from '@emotion/styled';
import { Button } from '@kux/mui';
import { useCallback } from 'react';
import errorImg from 'static/legal/id-error.svg';
import reviewImg from 'static/legal/id-review.svg';
import { StatusEmpty } from '../../Components';
import { _t } from '../../utils';

const BtnWrapper = styled.div`
  margin-top: 40px;
`;

const ReviewStatus = () => {
  return (
    <StatusEmpty
      description={_t('kpfCyA5FMAfiFduSAzarX7', '核实处理中...')}
      subDescription={_t(
        'mYWysnYUHzaykLXfBe92rE',
        '身份信息核实中，通过后会邮件告知您，届时可提交司法协查信息',
      )}
      imgSrc={reviewImg}
    />
  );
};

const ErrorStatus = (props) => {
  const { onChange, linkKey, reason, screen } = props;
  const goSubmit = useCallback(() => {
    onChange(linkKey);
  }, [onChange, linkKey]);
  const isSmallScreen = screen === 'Max768';
  return (
    <StatusEmpty
      description={_t('wm3hrNa7QuwkZEJMMD4i82', '抱歉，您提交的材料未能通过身份核验')}
      subDescription={reason}
      imgSrc={errorImg}
    >
      <BtnWrapper>
        <Button type="primary" fullWidth={isSmallScreen} onClick={goSubmit}>
          {_t('wf6MS5aBwNmgF6Doeg75VE', '重新提交材料')}
        </Button>
      </BtnWrapper>
    </StatusEmpty>
  );
};

export { ReviewStatus, ErrorStatus };
