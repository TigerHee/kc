/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import question from 'static/spotlight6/question.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const Wrapper = styled.div`
  width: 100%;
  padding-top: 88px;
`;

const Items = styled.div``;

const Item = styled.div`
  margin-bottom: 50px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 30px;
  }
`;

const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  color: #e1e8f5;
  margin-bottom: 12px;
`;

const ItemContent = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(225, 232, 245, 0.68);

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 21px;
  }
`;

function convertDataToDisplayText(data) {
  try {
    const arr = JSON.parse(data);
    return arr.map(({ type, content, href }) => {
      if (type === 'link') {
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        );
      } else if (type === 'text') {
        return <span>{content}</span>;
      }
    });
  } catch {
    // 兼容原数据
    return data;
  }
}

const Faq = () => {
  const { faqModule = [] } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
  return !faqModule?.length ? null : (
    <Wrapper id="faq">
      <Title title={_t('newhomepage.faq')} icon={question} />
      <Items>
        {map(faqModule, ({ title, content }, index) => {
          return (
            <Item key={`faqItem_${index}`}>
              <ItemTitle>{title}</ItemTitle>
              <ItemContent>{convertDataToDisplayText(content)}</ItemContent>
            </Item>
          );
        })}
      </Items>
    </Wrapper>
  );
};

export default Faq;
