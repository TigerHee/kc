/**
 * Owner: tiger@kupotech.com
 */
import { useMultiSiteConfig } from 'gbiz-next/hooks';
import { Dropdown, styled } from '@kux/mui';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderConfig } from 'components/ExternalBindingsDialog/config.js';
import { _t } from 'tools/i18n';
import { BottomItem, ItemDesc, NoLinkItemTitle } from './styled';

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

const Icon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  &:not(:last-child) {
    margin-right: 6px;
  }
`;

export default ({ hideBalanceAmount }) => {
  const dispatch = useDispatch();
  const externalBindings = useSelector((state) => state.account_security.externalBindings);
  const { multiSiteConfig } = useMultiSiteConfig();

  useEffect(() => {
    if (multiSiteConfig && multiSiteConfig?.securityConfig?.extAccountBindOpt) {
      // 支持才会发起请求
      dispatch({
        type: 'account_security/getExternalBindings',
      });
    }
  }, [dispatch, multiSiteConfig]);

  return externalBindings?.length > 0 ? (
    <BottomItem>
      <Dropdown
        trigger="hover"
        overlay={
          <TooltipsWrapper>
            {externalBindings.map(({ extPlatform, extAccount }) => {
              const renderData = renderConfig[extPlatform];
              return (
                <Item key={extPlatform}>
                  <Title>{renderData?.label}</Title>
                  <Desc>{extAccount}</Desc>
                </Item>
              );
            })}

            <TooltipArrow>
              <TooltipArrowContent />
            </TooltipArrow>
          </TooltipsWrapper>
        }
      >
        <NoLinkItemTitle>{_t('9YoftXrci66tYdGUbwa8uH')}</NoLinkItemTitle>
      </Dropdown>
      <ItemDesc>
        <span>
          {hideBalanceAmount
            ? '**'
            : externalBindings.map(({ extPlatform }) => {
              const renderData = renderConfig[extPlatform];
              return <Icon src={renderData?.icon} key={extPlatform} alt={extPlatform} />;
            })}
        </span>
      </ItemDesc>
    </BottomItem>
  ) : null;
};
