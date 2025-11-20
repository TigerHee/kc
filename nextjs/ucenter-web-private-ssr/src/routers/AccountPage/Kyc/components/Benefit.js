import { ICHookOutlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import rewardDarkIconSrc from 'static/account/kyc/brandUpgrade/rewardIcon.dark.svg';
import rewardIconSrc from 'static/account/kyc/brandUpgrade/rewardIcon.svg';

const BenefitBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover2};
  padding: 16px 16px 20px 16px;
  gap: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 18px;
  }
`;

const UnlockBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const RewardMsg = styled.div`
  display: flex;
  padding: 8px 10px;
  align-items: flex-start;
  word-break: break-word;
  gap: 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary4};
  color: ${({ theme }) => theme.colors.text60};
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
  & > p {
    padding-top: 1px;
  }
  & > p > span > span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const UnlockInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > div:first-child {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
  }
  & > ul:nth-child(2) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
    & > li {
      display: flex;
      gap: 4px;
      align-items: center;
      min-width: 120px;
      ${({ theme }) => theme.breakpoints.down('sm')} {
        min-width: 100px;
      }
    }
  }
`;

export const Divider = styled.div`
  height: 0.5px;
  background: ${({ theme }) => theme.colors.divider8};
`;

export const CollectBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > div:first-child {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
  }
  & > ul:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 1em;
    color: ${({ theme }) => theme.colors.text30};
    font-weight: 400;
    font-size: 15px;
    line-height: 140%;
    list-style: disc;
    & > li > span {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

const Benefit = ({ unlockInfos, collectInfos = [], rewardMsg, bottomSlot, ...props }) => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  return (
    <BenefitBox {...props}>
      <UnlockBox>
        {rewardMsg ? (
          <RewardMsg>
            <img src={isDark ? rewardDarkIconSrc : rewardIconSrc} alt="icon" />
            <p>{rewardMsg}</p>
          </RewardMsg>
        ) : null}
        <UnlockInfos>
          <div>{_t('9524c661b3304000ab4c')}</div>
          <ul>
            {unlockInfos.map((info) => {
              return (
                <li key={info}>
                  <ICHookOutlined size={14} />
                  {info}
                </li>
              );
            })}
          </ul>
        </UnlockInfos>
      </UnlockBox>
      {collectInfos.length ? (
        <>
          <Divider />
          <CollectBox>
            <div>{_t('25aa644f1a0d4000ac7a')}</div>
            <ul>
              {collectInfos.map((info) => (
                <li key={info}>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </CollectBox>
        </>
      ) : null}
      {bottomSlot}
    </BenefitBox>
  );
};

export default Benefit;
