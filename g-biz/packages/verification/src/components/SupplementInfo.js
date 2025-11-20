/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { Parser } from 'html-to-react';
import useLang from '../hooks/useLang';
import plugins from '../plugins';
import { METHODS } from '../constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ErrorSection = styled.div`
  > span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;
const BoldText = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const htmlToReactParser = new Parser();

/** 补充信息 */
export default function SupplementInfo({ supplement = [] }) {
  const { _t } = useLang();

  return (
    <Container>
      <ErrorSection>{htmlToReactParser.parse(_t('safe_verify_matching_empty_hint1'))}</ErrorSection>
      <ErrorSection>
        {supplement.map((list, li) => {
          if (!list.every(plugins.has)) {
            return null;
          }
          return (
            <BoldText key={list.join(',')}>
              {`${li + 1}. `}
              {list.map((item, ii) => {
                const { Name } = plugins.get(item) ?? {};
                const name = <Name recommend={item === METHODS.PASSKEY} />;
                return ii > 0 ? <span key={item}> + {name}</span> : name;
              })}
            </BoldText>
          );
        })}
      </ErrorSection>
      <ErrorSection>{_t('safe_verify_matching_empty_hint2')}</ErrorSection>
    </Container>
  );
}
