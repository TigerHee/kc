/**
 * Owner: willen@kupotech.com
 */
import { Dropdown, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import Link from 'kc-next/link';

const TooltipsWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tip};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  margin-top: 10px;
  cursor: default;
`;
const Item = styled.div`
  margin-right: 20px;
  &:nth-of-type(4) {
    margin-right: 0;
  }
`;
const Title = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.icon};
  margin-bottom: 2px;
`;
const Desc = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #ffffff;
`;

const TooltipArrow = styled.div`
  overflow: hidden;
  position: absolute;
  width: 16px;
  box-sizing: border-box;
  transition: none;
  pointer-events: none;
  background: 0 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  top: -8px;
  left: 0;
  right: 0;
  margin: auto;
`;

const TooltipArrowContent = styled.span`
  width: 16px;
  height: 16px;
  background: ${(props) => props.theme.colors.tip};
  box-shadow: ${(props) => props.theme.shadows.middle};
  margin: auto;
  pointer-events: none;
  display: block;
  transform: translateY(4px) rotate(45deg);
`;

const SecurityTooltips = ({ children }) => {
  const securtyStatus = useSelector((s) => s.user.securtyStatus);
  const user = useSelector((s) => s.user.user);
  return (
    <Dropdown
      trigger="hover"
      overlay={
        <TooltipsWrapper>
          <Item>
            <Title>{_t('isyceFYjCDi16CGUPhCshb')}</Title>
            {securtyStatus?.EMAIL ? (
              <Desc>{user?.email}</Desc>
            ) : (
              <Desc>
                <Link href="/account/security/email">
                  {_t('54tW8qq8RMSzEAEXnmbt1q')}
                </Link>
              </Desc>
            )}
          </Item>
          <Item>
            <Title>{_t('t8Ca62DALsLzYBcnK7oBTb')}</Title>
            {securtyStatus?.SMS ? (
              <Desc>{user?.phone}</Desc>
            ) : (
              <Desc>
                <Link href="/account/security/phone">
                  {_t('54tW8qq8RMSzEAEXnmbt1q')}
                </Link>
              </Desc>
            )}
          </Item>
          <Item>
            <Title>{_t('kpFxektXRT3BgH7FjxZA9X')}</Title>
            {securtyStatus?.WITHDRAW_PASSWORD ? (
              <Desc>{_t('dkTDHH1rMFtT32PpBcgArh')}</Desc>
            ) : (
              <Desc>
                <Link href="/account/security/protect">
                  {_t('54tW8qq8RMSzEAEXnmbt1q')}
                </Link>
              </Desc>
            )}
          </Item>
          <Item>
            <Title>{_t('b39sZnT9Q94FMgUQYyjaAt')}</Title>
            {securtyStatus?.GOOGLE2FA ? (
              <Desc>{_t('uq5VbsEjPhaArLzqJhb7xm')}</Desc>
            ) : (
              <Desc>
                <Link href="/account/security/g2fa">{_t('kMeTCs4CatMrfiGhnqdTgC')}</Link>
              </Desc>
            )}
          </Item>
          <TooltipArrow>
            <TooltipArrowContent />
          </TooltipArrow>
        </TooltipsWrapper>
      }
    >
      {children}
    </Dropdown>
  );
};

export default SecurityTooltips;
