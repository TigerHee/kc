/**
 * Owner: tiger@kupotech.com
 */
import { useOauthLogin } from '@kucoin-biz/hooks';
import { Dialog, Empty, Spin, styled, useSnackbar, useTheme } from '@kux/mui';
import ModalSecForm from 'components/Assets/Withdraw/NewModalSecurity';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkValidations } from 'services/security';
import { bindExternal } from 'services/user';
import arrowRightIcon from 'static/account/overview/external/arrow-right.svg';
import { _t } from 'tools/i18n';
import { bizType, defaultExternalList, renderConfig } from './config';
import UnbindDialog from './UnbindDialog';

const Wrapper = styled.div`
  padding-bottom: 40px;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 20px 24px;
  transition: all 300ms;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
`;
const ItemLeft = styled.div`
  display: flex;
  align-items: center;
`;
const ImgBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${({ theme }) => theme.colors.cover4};
`;
const ExternalIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const AccountInfo = styled.div``;
const Label = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 2px;
  color: ${({ theme }) => theme.colors.text};
`;
const Account = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;
const ItemRight = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  span {
    margin-right: 2px;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
  img {
    width: 16px;
    height: 16px;
  }
`;
const GoogleLoginBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.001;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: scale(1.3);
`;

const EmptyBox = styled.div`
  text-align: center;
`;

// 安全验证通过执行的回调
let secCallback = () => {};

export default ({ open, onCancel }) => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const externalBindings = useSelector((state) => state.account_security.externalBindings);
  const isListLoading = useSelector(
    (state) => state.loading.effects['account_security/getExternalBindings'],
  );
  const oauthLogin = useOauthLogin(defaultExternalList.map((i) => i.extPlatform).join(','));

  // 渲染列表
  const [list, setList] = useState([]);
  // 解绑弹窗是否显示
  const [isUnbindOpen, setUnbindOpen] = useState(false);
  // 安全验证弹窗是否显示
  const [isSecModalOpen, setSecModalOpen] = useState(false);
  // 安全校验类型
  const [verifyType, setVerifyType] = useState([]);
  // 当前操作项
  const [curItem, setCurItem] = useState(null);
  // 绑定loading
  const [isBindLoading, setBindLoading] = useState(false);

  // 处理列表渲染数据
  useEffect(() => {
    const newList = defaultExternalList.map((item) => {
      const bindingData = externalBindings.find((i) => i.extPlatform === item.extPlatform);
      return { ...item, ...bindingData, ready: oauthLogin[item.extPlatform]?.ready };
    });
    setList(newList);
  }, [externalBindings, oauthLogin]);

  // 绑定谷歌登录按钮到页面dom
  useEffect(() => {
    const googleItem = list.find((i) => i.extPlatform === 'GOOGLE');
    if (googleItem?.ready && open) {
      const timer = window.setInterval(() => {
        const el = document.getElementById('GoogleLoginBoxId');
        if (el) {
          oauthLogin.GOOGLE.bind({
            renderButtonDom: el,
            callback: (res) => {
              secCallback = () => {
                onBind(res?.data, 'GOOGLE');
              };

              onCheckValidate();
            },
          });
          window.clearInterval(timer);
        }
      }, 100);
    }
  }, [list, oauthLogin.GOOGLE, open]);

  // 检查是否需要安全校验
  const onCheckValidate = async (cb) => {
    if (cb) {
      secCallback = cb;
    }

    const res = await checkValidations({ bizType });
    if (res?.data?.length > 0) {
      setVerifyType(res?.data);
      setSecModalOpen(true);
    } else {
      secCallback && secCallback();
    }
  };

  // 区分解绑 or 绑定
  const onDiffOperate = debounce(async (item) => {
    setCurItem(item);
    const { status, extPlatform } = item;
    if (status === 1) {
      // 解绑
      setUnbindOpen(true);
      return;
    }
    // 绑定
    try {
      if (extPlatform === 'TELEGRAM') {
        const res = await oauthLogin.TELEGRAM?.login();
        secCallback = () => {
          onBind(res?.data, extPlatform);
        };
        onCheckValidate();
      } else if (extPlatform === 'APPLE') {
        const { data } = (await oauthLogin.APPLE?.login()) || {};
        secCallback = () => {
          onBind(
            {
              via: 'web',
              identityToken: data?.authorization?.id_token,
              authorizationCode: data?.authorization?.code,
            },
            extPlatform,
          );
        };
        onCheckValidate();
      }
    } catch (error) {
      console.log('onDiffOperate error === ', error);
    }
  }, 300);

  // 执行绑定
  const onBind = (extInfo, extPlatform) => {
    setBindLoading(true);
    bindExternal({ extInfo, extPlatform })
      .then((res) => {
        if (res?.success) {
          message.success(_t('fKWLUV1hL4z5JTZuwXinvR'));
          dispatch({
            type: 'account_security/getExternalBindings',
          });
        }
      })
      .catch((err) => {
        err?.msg && message.error(err?.msg);
      })
      .finally(() => {
        setBindLoading(false);
      });
  };

  return (
    <>
      <Dialog
        title={_t('9YoftXrci66tYdGUbwa8uH')}
        size="medium"
        footer={null}
        style={{ margin: 16 }}
        open={open}
        onCancel={onCancel}
      >
        <Spin spinning={isBindLoading || isListLoading} type="brand" size="small">
          <Wrapper>
            {list?.length ? (
              list?.map((item) => {
                const { extPlatform, extAccount, status, ready } = item;
                const renderDaa = renderConfig[extPlatform];
                // 已绑定
                const isBound = status === 1;
                // google绑定按钮特殊处理
                const isShowGoogleBind = extPlatform === 'GOOGLE' && !isBound;

                return ready ? (
                  <Item key={extPlatform}>
                    <ItemLeft>
                      <ImgBox>
                        {extPlatform === 'APPLE' ? (
                          <ExternalIcon
                            src={currentTheme === 'light' ? renderDaa?.icon : renderDaa?.darkIcon}
                            alt="External"
                          />
                        ) : (
                          <ExternalIcon src={renderDaa?.icon} alt="External" />
                        )}
                      </ImgBox>
                      <AccountInfo>
                        <Label>{renderDaa?.label}</Label>
                        {extAccount ? <Account>{extAccount}</Account> : null}
                      </AccountInfo>
                    </ItemLeft>
                    {isShowGoogleBind ? (
                      <ItemRight>
                        <span>{_t('8eaNDkdXWjm3qmuQ418Y5u')}</span>
                        <img src={arrowRightIcon} alt="arrow-right" />
                        <GoogleLoginBox id="GoogleLoginBoxId" />
                      </ItemRight>
                    ) : (
                      <ItemRight onClick={() => onDiffOperate(item)}>
                        <span>
                          {isBound ? _t('94JeGusfZS5Yo1tiHSnohP') : _t('8eaNDkdXWjm3qmuQ418Y5u')}
                        </span>
                        <img src={arrowRightIcon} alt="arrow-right" />
                      </ItemRight>
                    )}
                  </Item>
                ) : null;
              })
            ) : (
              <EmptyBox>
                <Empty size="small" />
              </EmptyBox>
            )}
          </Wrapper>
        </Spin>
      </Dialog>
      {/* 解绑弹窗 */}
      <UnbindDialog
        open={isUnbindOpen}
        onCancel={() => setUnbindOpen(false)}
        curItem={curItem}
        onCheckValidate={onCheckValidate}
      />
      {/* 安全验证弹窗 */}
      {isSecModalOpen && (
        <ModalSecForm
          withPwd={false}
          visible={isSecModalOpen}
          onCancel={() => {
            setSecModalOpen(false);
          }}
          handleResult={(res) => {
            if (res?.success) {
              secCallback();
              setSecModalOpen(false);
            } else {
              res?.msg && message.error(res?.msg);
            }
          }}
          verifyConfig={{
            verifyType,
            bizType,
          }}
          isUseV2={true}
        />
      )}
    </>
  );
};
