/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICArrowDownOutlined, ICArrowUpOutlined, ICCheckboxArrowOutlined } from '@kux/icons';
import { Button, styled, useResponsive } from '@kux/mui';
import { useState } from 'react';
import { getIsAndroid } from 'src/components/InviteBenefits/tools/helper';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import noteIcon from 'static/account/transfer/text-note.svg';
import { CAN_RESOLVE_STATUS, DONE_STATUS, FORBID_STATUS, RESOLVING_STATUS } from '../constants';

/**
 * CardProps
 * @typedef {object} CardProps
 * @property {ReactNode} children - 卡片内容
 * @property {-1 | 0 | 1 | 2 | 3} status - -1-不需要处理 0-禁止处理 1-可以处理 2-进行中 3-已完成
 * @property {string} title - 卡片标题
 * @property {string} subTitle - 卡片副标题
 * @property {number} order - 卡片序号
 * @property {number} curOrder - 正在进行的卡片序号
 * @property {string} btnTxt - 按钮文字
 * @property {ReactNode} btn - 自定义按钮
 * @property {string} note - 提示文字
 * @property {boolean} showContent - 是否显示内容
 * @property {Function} onConfirm - 退出/撤销按钮点击事件
 * @property {(expand: boolean) => void} onExpand - 展开/收起按钮点击事件, expand: 是否展开
 */

// 影响sticky的容错值(border,小数等)
const COMPATIBLE_VALUE = 3;
// PC顶部返回按钮的高度
const PC_TOP_BTN_HEIGHT = 75;
// H5顶部返回按钮的高度
const H5_TOP_BTN_HEIGHT = 67;
// Android吸顶距顶高度
const ANDROID_STICKY_TOP = 58;
// IOS吸顶距顶高度
const IOS_STICKY_TOP = 100;

const getCompatibleStickyTop = (value, isH5 = false) => {
  const isApp = JsBridge.isApp();
  const isAndroid = getIsAndroid();
  if (isApp) {
    return isAndroid ? ANDROID_STICKY_TOP : IOS_STICKY_TOP;
  }
  return isH5
    ? value + H5_TOP_BTN_HEIGHT - COMPATIBLE_VALUE
    : value + PC_TOP_BTN_HEIGHT - COMPATIBLE_VALUE;
};

/**
 * 内容卡片 - 一键处理
 * @param {CardProps} props - 卡片属性
 */
export default function Card(props) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const ResponsiveCard = isH5 ? H5Card : PCCard;
  return <ResponsiveCard {...props} />;
}

const PCNoteCom = (props) => {
  const { note, status } = props || {};

  const disabled = status === FORBID_STATUS;
  const loading = status === RESOLVING_STATUS;
  if (!note && !loading) return null;
  return disabled || loading ? (
    <NoteBox>
      {/* todo: 直接用 reactComponent 以适配暗色模式 */}
      <img src={noteIcon} alt="Note Icon" width={14} height={14} style={{ marginTop: 1 }} />
      <NoteText>{loading ? _t('c97bf9830f754000a6e2') : note}</NoteText>
    </NoteBox>
  ) : null;
};

/**
 * H5Card
 * @param {CardProps} props - 卡片属性
 */
function PCCard(props) {
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight);

  const disabled = props.status === FORBID_STATUS;
  const loading = props.status === RESOLVING_STATUS;
  const done = props.status === DONE_STATUS;

  const Btn = () => {
    if (props.btn) {
      return <>{props.btn}</>;
    }
    if (done) {
      return <Done>{_t('withdraw.v2.security.success')}</Done>;
    }
    return (
      <Button disabled={disabled && !loading} loading={loading} onClick={() => props.onConfirm()}>
        {loading ? null : props.btnTxt}
      </Button>
    );
  };

  return (
    <PCWrapper>
      <Head stickyTop={getCompatibleStickyTop(totalHeaderHeight)}>
        <TitleBox>
          <Order status={props.status}>{done ? <ICCheckboxArrowOutlined /> : props.order}</Order>
          <div>
            <Title status={props.status}>{props.title}</Title>
            <SubTitle>{props.subTitle}</SubTitle>
          </div>
        </TitleBox>
        <BtnBox>
          <PCNoteCom {...props} />
          <Btn />
        </BtnBox>
      </Head>
      {!done && props.showContent ? <ContentBox>{props.children}</ContentBox> : null}
    </PCWrapper>
  );
}

const StickyBox = styled.div`
  position: sticky;
  /* top: 0px; */
  top: ${({ stickyTop }) => `${stickyTop}px`};
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

const CardSection = styled.div`
  position: relative;
`;

/**
 * H5Card
 * @param {CardProps} props - 卡片属性
 */
function H5Card(props) {
  const [expand, setExpand] = useState(false);
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight);
  const isApp = JsBridge.isApp();
  const Icon = expand ? ICArrowUpOutlined : ICArrowDownOutlined;
  const disabled = props.status === FORBID_STATUS;
  const enabled = props.status === CAN_RESOLVE_STATUS;
  const loading = props.status === RESOLVING_STATUS;
  const done = props.status === DONE_STATUS;

  const toggle = () => {
    setExpand(!expand);
    props.onExpand?.(!expand);
  };

  const Btn = () => {
    if (done) return <Done>{_t('withdraw.v2.security.success')}</Done>;
    return <Icon size={24} style={{ alignSelf: 'flex-start' }} onClick={toggle} />;
  };

  return (
    <CardSection>
      <StickyBox
        isApp={isApp}
        stickyTop={getCompatibleStickyTop(totalHeaderHeight, true)}
        style={{ paddingBottom: 12 }}
      >
        <H5HeadBox status={props.status}>
          <Head>
            <TitleBox onClick={toggle}>
              <Order status={props.status}>
                {done ? <ICCheckboxArrowOutlined /> : props.order}
              </Order>
              <div>
                <Title status={props.status}>{props.title}</Title>
                {enabled || loading ? (
                  <SubTitle isH5 status={props.status}>
                    {loading ? _t('c97bf9830f754000a6e2') : props.subTitle}
                  </SubTitle>
                ) : null}
              </div>
            </TitleBox>
            {expand && (enabled || loading) ? (
              <BtnBox>
                <Button
                  size="mini"
                  loading={loading}
                  disabled={disabled}
                  onClick={() => {
                    if (loading || disabled) return;
                    props.onConfirm?.();
                  }}
                >
                  {loading ? null : props.btnTxt}
                </Button>
              </BtnBox>
            ) : null}
          </Head>
          <Btn />
        </H5HeadBox>
        <NoteCom status={props.status} expand={expand} note={props.note} />
      </StickyBox>
      {expand && !done && props.showContent ? <>{props.children}</> : null}
    </CardSection>
  );
}

function NoteCom(props) {
  if (!props.note) return null;
  return props.status ? null : (
    <NoteBox>
      <img src={noteIcon} alt="Note Icon" width={14} height={14} style={{ marginTop: 1 }} />
      <NoteText>{props.note}</NoteText>
    </NoteBox>
  );
}

const PCWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  position: sticky;
  top: ${({ stickyTop }) => (stickyTop ? `${stickyTop}px` : 0)};
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.overlay};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
`;

const H5HeadBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: ${({ theme, status }) => (status ? theme.colors.text : theme.colors.text40)};
`;

const TitleBox = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  line-height: 140%;
  color: ${({ theme, status }) => (status ? theme.colors.text : theme.colors.text40)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const SubTitle = styled.p`
  margin-top: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: ${({ theme, status, isH5 }) =>
    isH5 && status === 2 ? theme.colors.complementary : theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const Order = styled.div`
  margin-top: 2px;
  display: flex;
  width: 23px;
  height: 23px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border-radius: 50%;
  font-weight: 500;
  background: ${({ theme, status }) => (status ? theme.colors.text : theme.colors.text30)};
  color: ${({ theme }) => theme.colors.backgroundMajor};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
    margin-top: 0.4px;
    font-size: 12px;
  }
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 8px 0px 0 0px;
  }
`;

const NoteBox = styled.div`
  display: flex;
  padding: 0 12px;
  align-items: flex-start;
  gap: 6px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 5px;
    // margin-bottom: 17px;
    padding: 0 28px;
  }
`;

const NoteText = styled.span`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-weight: 400;
  max-width: 160px;
`;

const ContentBox = styled.div`
  padding: 24px 32px 20px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
`;

const Done = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
