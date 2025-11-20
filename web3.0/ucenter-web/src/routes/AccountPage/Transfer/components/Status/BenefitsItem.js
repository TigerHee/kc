/**
 * Owner: jacky@kupotech.com
 */

import { styled } from '@kux/mui';
import correctIcon from 'static/account/transfer/correct.svg';

/**
 * 用户权益条目，迁移成功或受阻时展示
 * @param {Object} param
 * @param {string} param.description
 */
function Item({ description }) {
  return (
    <BenefitsItem>
      <Icon src={correctIcon} alt="status" />
      {description}
    </BenefitsItem>
  );
}

export default function Benefits({ title, items = [], footer }) {
  return (
    <BenefitsList>
      <BenefitsTitle>{title}</BenefitsTitle>
      {items.map((item) => {
        return <Item key={item} description={item} />;
      })}
      {footer ? <Divider /> : null}
      {footer ? footer : null}
    </BenefitsList>
  );
}

const BenefitsList = styled.div`
  padding: 32px 28px;
  width: 100%;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

const BenefitsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  margin-bottom: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const BenefitsItem = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
  &:last-child {
    margin-bottom: 0;
  }
`;

const Icon = styled.img`
  width: 14px;
  height: 14px;
`;

const Divider = styled.div`
  margin: 22px 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.divider4};
  margin: 16px 0;
`;
