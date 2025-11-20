import useLocale from 'hooks/useLocale';
import useHistoryBlocker from 'hooks/useHistoryBlocker';
import { Box, Button, Dialog, Form, useTheme } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'kc-next/router';
import { push } from '@/utils/router';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import retainHeaderDarkIcon from 'static/account/kyc/brandUpgrade/retainHeader.dark.png';
import retainHeaderIcon from 'static/account/kyc/brandUpgrade/retainHeader.png';
import useRewardAmount from '../../hooks/useRewardAmount';
import useKyc3Status from '../../KycHome/site/KC/hooks/useKyc3Status';
import formatLocalLangNumber from '../../utils/formatLocalLangNumber';
import {
  Content,
  Desc,
  Footer,
  Group,
  Item,
  ItemLabel,
  ItemTextarea,
  RewardDesc,
  RewardFooter,
  RewardHeader,
  RewardTitle,
} from './styled';
import { IS_SSR_MODE } from 'kc-next/env';

const WHITE_LIST = ['/account/kyc', '/account/kyb'];

const { useForm, FormItem, useWatch } = Form;

const ExItem = ({ value, label, desc, reasons = [] }) => {
  return (
    <Item value={value} checkOptions={{ type: 1, checkedType: 1 }}>
      <ItemLabel>
        <span>{label}</span>
        <Desc show={reasons.indexOf(value) > -1}>{desc}</Desc>
      </ItemLabel>
    </Item>
  );
};

const FormContent = ({ onContinue, onExist }) => {
  const [form] = useForm();
  const reasons = useWatch('reasons', form);
  const prevReasonRef = useRef([]);
  const otherTextareaRef = useRef();

  const handleExist = () => {
    /** @todo 提交埋点 */
    onExist();
  };

  useEffect(() => {
    const _reasons = reasons ?? [];
    if (prevReasonRef.current.indexOf('5') < 0 && _reasons.indexOf('5') > -1) {
      otherTextareaRef.current?.focus();
    }
    prevReasonRef.current = [..._reasons];
  }, [reasons]);

  return (
    <Content>
      <Desc>{_t('83903dd8ac494800ab75')}</Desc>
      <Box size={24} />
      <Form form={form}>
        <FormItem name="reasons">
          <Group>
            <ExItem
              value="1"
              label={_t('69ffbfe745764000a479')}
              desc={_t('813053084d584000a78b')}
              reasons={reasons}
            />
            <ExItem
              value="2"
              label={_t('c5655032b2df4800ae3d')}
              desc={_tHTML('723ee623679b4000a90a', { url: addLangToPath('/web3') })}
              reasons={reasons}
            />
            <ExItem
              value="3"
              label={_t('1907c8c0e9134800a711')}
              desc={_t('41de8ffa609e4000ae0d')}
              reasons={reasons}
            />
            <ExItem
              value="4"
              label={_t('ebd601761e1d4000a739')}
              desc={_t('70574a2692ec4800a55b')}
              reasons={reasons}
            />
            <ExItem
              value="5"
              label={_t('68ba8b08d9d64800a885')}
              desc={
                <ItemTextarea
                  ref={otherTextareaRef}
                  minRows={4}
                  placeholder={_t('a296b02dbc594800a182')}
                />
              }
              reasons={reasons}
            />
          </Group>
        </FormItem>
      </Form>
      <Box size={32} />
      <Footer>
        <Button variant="text" onClick={onContinue}>
          {_t('prYLqSst5vbHXHnauLRNM1')}
        </Button>
        <Button disabled={!reasons?.length} onClick={handleExist}>
          {_t('9ee9df67a3c94000a403')}
        </Button>
      </Footer>
    </Content>
  );
};

const RewardContent = ({ amount, onExist, onContinue }) => {
  const theme = useTheme();
  const { currentLang } = useLocale();
  const isDark = theme.currentTheme === 'dark';
  const formatAmount = formatLocalLangNumber({
    data: amount,
    lang: currentLang,
    interceptDigits: 2,
  });
  return (
    <Content noMg>
      <img src={isDark ? retainHeaderDarkIcon : retainHeaderIcon} alt="icon" />
      <RewardHeader>
        <RewardTitle>
          {_tHTML('6a81c88c86974000acaf', {
            amount: formatAmount,
            currency: 'USDT',
          })}
        </RewardTitle>
        <RewardDesc>{_t('ff02d99965f84800a109')}</RewardDesc>
      </RewardHeader>
      <RewardFooter>
        <Button onClick={onExist}>{_t('9ee9df67a3c94000a403')}</Button>
        <Button variant="text" onClick={onContinue}>
          {_t('prYLqSst5vbHXHnauLRNM1')}
        </Button>
      </RewardFooter>
    </Content>
  );
};

const KycRetainBasic = ({ open, onExist, onCancel }) => {
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const rewardAmount = useRewardAmount();

  const showReward = rewardAmount > 0 && kyc3Status === kyc3StatusEnum.REJECTED;

  return (
    <Dialog
      size={showReward ? 'basic' : 'medium'}
      open={open}
      title={_t('0ae513096e3b4800ab9e')}
      header={showReward ? null : undefined}
      footer={null}
      onCancel={onCancel}
    >
      {showReward ? (
        <RewardContent amount={rewardAmount} onExist={onExist} onContinue={onCancel} />
      ) : (
        <FormContent onExist={onExist} onContinue={onCancel} />
      )}
    </Dialog>
  );
};
const KycRetainSSR = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nextUrlRef = useRef(null);

  const handleExist = async () => {
    if (nextUrlRef.current) {
      // 点击挽留弹窗的继续按钮，跳转到被拦截的路径
      await push(nextUrlRef.current);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    nextUrlRef.current = null;
  };

  useEffect(() => {
    if (open) return;
    const handleRouteChangeStart = (url) => {
      let pathname = url.split('?')[0];
      const locale = router?.locale;
      if (pathname.startsWith(`/${locale}`)) {
        pathname = pathname.substring(locale.length + 1);
      }

      if (!WHITE_LIST.some((path) => pathname.startsWith(path))) {
        nextUrlRef.current = url;
        setOpen(true);
        throw new Error('道友请留步');
      }
    };
    router?.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router?.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [open, router]);

  return <KycRetainBasic open={open} onExist={handleExist} onCancel={handleCancel} />;
};
const KycRetainCSR = () => {
  const [open, setOpen] = useState(false);
  const nextLocationRef = useRef(null);
  const router = useRouter();
  const locale = router?.locale;

  // 创建路由拦截器
  useHistoryBlocker((tx) => {
    let pathname = tx.location?.pathname || '';
    if (pathname.startsWith(`/${locale}`)) {
      pathname = pathname.substring(locale.length + 1);
    }
    if (WHITE_LIST.some((path) => pathname.startsWith(path))) {
      tx.retry();
      return;
    }
    // 不在白名单里的路径需要拦截，弹出挽留弹窗
    nextLocationRef.current = tx;
    setOpen(true);
  }, !open);

  const handleExist = () => {
    const tx = nextLocationRef.current;
    if (tx) {
      nextLocationRef.current = null;
      setOpen(false);
      tx.retry();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    nextLocationRef.current = null;
  };

  return <KycRetainBasic open={open} onExist={handleExist} onCancel={handleCancel} />;
};

const KycRetain = () => {
  if (IS_SSR_MODE) {
    return <KycRetainSSR />;
  }
  return <KycRetainCSR />;
};

export default KycRetain;
