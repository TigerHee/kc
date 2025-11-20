/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Dialog, styled } from '@kufox/mui';
import { formatLocalLangNumber } from 'helper';

import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'src/tools/i18n';

// import bg from 'static/root/download/modal/bg.svg';
import close from 'static/root/download/modal/close.svg';
import bg from 'static/root/download/ueo/banner.png';
import DownloadATag from '../../components/DownloadATag';

const HeaderImg = styled.img`
  width: 100%;
  /* height: 160px; */
  /* margin-bottom: 28px; */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 16px;
`;

const Container = styled.div`
  border-radius: inherit;
`;

const Title = styled.div`
  /* font-weight: 500;
  font-size: 20px;
  line-height: 32px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
   */

  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  > span > span {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Desc = styled.div`
  /* font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 24px; */
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text68};

  & span span {
    color: #21c397;
  }
`;

const Flex = styled(DownloadATag)`
  display: flex;
  flex-direction: column;
`;

const CloseWrapper = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  margin-left: -18px;
`;

const CloseBtn = styled.img`
  width: 36px;
  height: 36px;
`;

const Content = styled.div`
  padding: 0 24px 24px;
`;

const Modal = styled(Dialog)`
  /* width: calc(100% - 72px) !important; */
  width: 300px;
  flex: unset !important;
  border-radius: 8px;

  & > div {
    padding: 0 !important;
  }
`;

// 500u 弹窗
export default ({ show, onClose, onDownload, downloadAppUrl } = {}) => {
  const { KuRewardsConfig } = useSelector((state) => state.newhomepage);
  const { currentLang } = useLocale();

  return (
    <Modal
      className="DownloadModal-Modal"
      maskClosable
      open={show}
      showCloseX={false}
      footer={null}
      header={null}
      rootProps={{
        style: {
          zIndex: 20000,
        },
      }}
    >
      <Container>
        <HeaderImg src={bg} />
        <Content>
          <Title>
            {_tHTML('caqRmxF3vbrsnNp2wHQoB3', {
              num: formatLocalLangNumber({
                data: KuRewardsConfig?.totalRewardAmountNum,
                lang: currentLang,
                interceptDigits: 2,
              }),
              currency: 'USDT',
            })}
          </Title>
          <Desc>{_t('cd7RaGbqmhhDwqQNqLRkWL')}</Desc>
          <Flex
            onClick={onDownload}
            href={downloadAppUrl || 'https://kucoin.onelink.me/iqEP/44gsnxav'}
          >
            <Button style={{ fontWeight: 600 }}>{_t('3QDhPZghfiecVS7waeehkA')}</Button>
          </Flex>
        </Content>
        <CloseWrapper>
          <CloseBtn src={close} onClick={onClose} />
        </CloseWrapper>
      </Container>
    </Modal>
  );
};
