/**
 * Owner: vijay@kupotech.com
 */
import { Avatar, Divider, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
// import InviterCardBgSrc from 'static/ucenter/signUp/inviter_card_bg.svg';

const Container = styled.div`
  padding: 32px 24px 36px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 48px;

  & .KuxAvatar-root {
    background-color: #d9d9d9;
    border: none;
  }
`;

const LayoutTop = styled.div`
  display: flex;
  gap: 0 24px;
`;

const LayoutLeft = styled.div``;
const UserFlag = styled.span`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 500;
  font-size: 32px;
  line-height: 130%;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.cover16};
`;

const LayoutRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  justify-content: center;
  flex: 1;
`;
const Nickname = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 500;
  line-height: 140%;
`;
const RCode = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
`;
const Message = styled.div`
  margin-top: 10px;
  margin-bottom: 32px;
  width: 380px;
  word-wrap: break-word;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover4};
  padding: 15px 16px;

  /* Shadows/light */
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 0 1px 0 rgba(0, 0, 0, 0.04);

  color: ${({ theme }) => theme.colors.text60};
  /* KuFox Sans/16px/Regular */
  font-family: 'KuFox Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;

const DividerLine = styled(Divider)`
  margin: 0;
`;

const LayoutBottom = styled.div`
  margin-top: 24px;
  .campaigns-title {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
    font-weight: 700;
    line-height: 140%;
  }
  .campaigns-list {
    display: flex;
    flex-direction: column;
  }
  .campaigns-item {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: 24px;

    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */

    &-icon {
      color: ${({ theme }) => theme.colors.text};
      margin-right: 8px;
      height: 16px;
      display: flex;
      padding: 1px 4px;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      border-radius: 8px 8px 8px 0;
      background: linear-gradient(276deg, #7FFCA7 0.89%, #AAFF8D 97.34%);
      font-size: 10px;
      font-weight: 700;
    }

    &-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 380px;
      word-wrap: break-word;
    }

    &-title {
      color: ${({ theme }) => theme.colors.text};
      font-size: 16px;
    }

    &-desc {
      color: ${({ theme }) => theme.colors.text40};
      font-size: 14px;
    }
`;

const Tag = styled.div`
  padding: 5px 12px;
  border-radius: 0 12px 0 12px;
  border-radius: 0px 12px;
  background: linear-gradient(103deg, #48d800 1.93%, #00b98a 98.71%);
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.textEmphasis};
  font-size: 11px;
  font-weight: 500;
  line-height: 130%;
`;

export function InviterCard({ inviterInfo }) {
  const { data } = useSelector((state) => state['$entrance_signUp']?.inviter ?? {});
  const inviter = inviterInfo ?? data;

  return inviter ? (
    <Container>
      <LayoutTop>
        <LayoutLeft>
          {inviter.avatar ? (
            <Avatar src={inviterInfo.avatar} size={80} />
          ) : (
            <UserFlag>{inviterInfo.userFlag}</UserFlag>
          )}
        </LayoutLeft>
        <LayoutRight>
          <Nickname>{inviterInfo.nickname}</Nickname>
          <RCode>
            {_t('b92d97fd317c4000afe2')}&nbsp;
            {inviter.rcode}
          </RCode>
          <Message>{inviter.message}</Message>
        </LayoutRight>
      </LayoutTop>
      <DividerLine />
      {inviter.campaigns ? (
        <LayoutBottom>
          <div className="campaigns-title">
            {_t('2a73b72f3e914800a6bc', { nickName: inviterInfo.nickname })}
          </div>
          <div className="campaigns-list">
            {inviter.campaigns.map((campaign) => (
              <div key={campaign.id} className="campaigns-item">
                <div className="campaigns-item-icon">{_t('d7f73574d8024000a5bf')}</div>
                <div className="campaigns-item-content">
                  <div className="campaigns-item-title">{campaign.title}</div>
                  <div className="campaigns-item-desc">{campaign.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </LayoutBottom>
      ) : null}
      {inviter.cashbackRatio ? <Tag>{inviterInfo.cashbackRatioText}</Tag> : null}
    </Container>
  ) : null;
}
