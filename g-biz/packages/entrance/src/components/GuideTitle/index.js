import React from 'react';
import { styled } from '@kux/mui';
import { useLang } from '../../hookTool';

const Title = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
`;

const TitleSection = styled.span`
  display: inline-flex;
  align-items: center;
`;
const Split = styled(Title)`
  text-decoration: none;
  margin: 0 8px;
`;

const SubTitle = styled(Split)`
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  line-height: 130%;
  .back {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  margin-top: ${(props) => (props.withDrawer ? '0px' : '16px')};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px; // H5 UI 间距调整，从 6px 改为 0px
    margin-bottom: 32px;
  }
`;

const GuideTitle = ({ onBack, title, inDrawer } = {}) => {
  const { t } = useLang();
  return (
    <Wrapper withDrawer={inDrawer}>
      <section className="back" onClick={onBack}>
        <Title>{t('login')}</Title>
      </section>
      {title && (
        <TitleSection>
          <Split>/</Split>
          <SubTitle>{title}</SubTitle>
        </TitleSection>
      )}
    </Wrapper>
  );
};

export default GuideTitle;
