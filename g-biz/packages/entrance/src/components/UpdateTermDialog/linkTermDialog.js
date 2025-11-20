/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from '@tools/i18n';
import { getTermUrl } from '@tools/term';
import DialogInfo from '../../../static/status-info.svg';
import DialogInfoDark from '../../../static/status-info-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';
import { kcsensorsManualTrack, kcsensorsClick } from '../../common/tools';
import { DialogWrapper, DialogContentWrapper, ImgWrap, DialogContent } from './styled';

const termI18nVariables = (list, handleClick) => {
  const i18nValues = {};
  const i18nComponents = {};
  const termList = (list || []).slice(0, 4);
  // 每次最多只展示 4 份协议
  termList.forEach((item, idx) => {
    i18nValues[`term${idx + 1}`] = item.title;
    i18nComponents[`a${idx + 1}`] = (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <a
        href={getTermUrl(item.termId)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          handleClick(item.termId, idx);
        }}
      />
    );
  });
  return {
    len: termList.length,
    i18nValues,
    i18nComponents,
  };
};

// 链接式协议更新弹窗标题，标题包含的协议最多支持4份协议，协议名称使用接口下发
const LINK_CONTENT_I18N_KEY = (termList = [], handleClick) => {
  const { len, i18nValues, i18nComponents } = termI18nVariables(termList, handleClick);
  return [
    // 1份协议占位, 只需要传入变量 term1
    <Trans
      key="21e139b9b81b4800a522"
      i18nKey="21e139b9b81b4800a522"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 2份协议占位, 需要传入变量 term1, term2
    <Trans
      key="6b8d52f068544000adfd"
      i18nKey="6b8d52f068544000adfd"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 3份协议占位, 需要传入变量 term1, term2, term3
    <Trans
      key="9bbed59d49514000a21d"
      i18nKey="9bbed59d49514000a21d"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 4份协议占位, 需要传入变量 term1, term2, term3, term4
    <Trans
      key="bfd00938e8374800a9bd"
      i18nKey="bfd00938e8374800a9bd"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
  ][len - 1];
};

// 链接式协议挽留弹窗标题，标题包含的协议最多支持4份协议，协议名称使用接口下发
const LINK_LEAVE_CONTENT_I18N_KEY = (termList = [], handleClick) => {
  const { len, i18nValues, i18nComponents } = termI18nVariables(termList, handleClick);
  return [
    // 1份协议占位, 只需要传入变量 term1
    <Trans
      key="2bb9135787584800ab72"
      i18nKey="2bb9135787584800ab72"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 2份协议占位, 需要传入变量 term1, term2
    <Trans
      key="db34af5391cc4000a8ec"
      i18nKey="db34af5391cc4000a8ec"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 3份协议占位, 需要传入变量 term1, term2, term3
    <Trans
      key="03259ee259aa4800a232"
      i18nKey="03259ee259aa4800a232"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    // 4份协议占位, 需要传入变量 term1, term2, term3, term4
    <Trans
      key="820bee8259d74000a9d2"
      i18nKey="820bee8259d74000a9d2"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
  ][len - 1];
};

// 链接式协议更新弹窗
export const LinkTermDialog = ({
  visible,
  userUpdateTermList,
  refuseSignTermHandle,
  signTermHandle,
  onClose,
}) => {
  const { getThemeImg } = useThemeImg();
  const { t: _t } = useTranslation('entrance');
  const hasInitRef = useRef(false);

  // 是否进入挽留弹窗
  const [isLeave, setIsLeave] = useState(false);
  // 当前协议是否打开过挽留弹窗，一份协议只打开一次
  const hasEnterLeaveDialog = useRef(false);

  // 点击同意协议
  const agreeHandle = () => {
    signTermHandle?.(
      userUpdateTermList.map((item) => ({
        termId: item.termId,
      })),
    );
    onClose?.();
  };

  // 协议弹窗 点击离开
  const onLeaveInTerm = () => {
    kcsensorsClick({
      spm: ['Agreement_Link', 'Leave'],
    });
    // 如果已经进入过一次挽留弹窗，不再进入挽留弹窗
    if (hasEnterLeaveDialog.current) {
      setIsLeave(false);
      // 如果拒绝，会踢出登陆，不用再调用 onClose 方法
      refuseSignTermHandle?.();
    } else {
      // 协议弹窗点击离开，进入挽留弹窗
      kcsensorsManualTrack({
        spm: ['Agreement_Link_Retain', 'Whole_Page'],
      });
      hasEnterLeaveDialog.current = true;
      setIsLeave(true);
    }
  };
  // 协议弹窗 点击同意
  const onAgreeInTerm = () => {
    kcsensorsClick({
      spm: ['Agreement_Link', 'Comfirm'],
    });
    agreeHandle();
  };
  // 挽留弹窗 点击离开
  const onLeaveInRetain = () => {
    kcsensorsClick({
      spm: ['Agreement_Link_Retain', 'Leave'],
    });
    setIsLeave(false);
    refuseSignTermHandle?.();
  };
  // 挽留弹窗 点击同意
  const onAgreeInRetain = () => {
    kcsensorsClick({
      spm: ['Agreement_Link_Retain', 'Comfirm'],
    });
    agreeHandle();
  };

  // 协议链接点击回调
  const linkClickHandle = (termId) => {
    kcsensorsClick({
      spm: ['Agreement_Link', 'Agreement'],
      agreement_ids: termId,
    });
  };

  useEffect(() => {
    // 进入协议弹窗曝光
    kcsensorsManualTrack({
      spm: ['Agreement_Link', 'Whole_Page'],
    });
  }, []);

  useEffect(() => {
    // 每份协议上报一次曝光
    if (userUpdateTermList && hasInitRef.current) {
      hasInitRef.current = false;
      userUpdateTermList.slice(0, 4).forEach((item) => {
        kcsensorsManualTrack({
          spm: ['Agreement_Link', 'Agreement'],
          agreement_ids: item.termId,
        });
      });
    }
  }, [userUpdateTermList]);

  return (
    <DialogWrapper
      open={visible}
      title={null}
      header={null}
      footer={null}
      onOk={null}
      onCancel={null}
      cancelText={null}
      okText={null}
      style={{ maxWidth: 400, width: '100%' }}
    >
      <DialogContentWrapper data-inspector="link_term_update_dialog_content">
        <ImgWrap>
          <img alt="term info tip" src={getThemeImg({ light: DialogInfo, dark: DialogInfoDark })} />
        </ImgWrap>
        {!isLeave ? (
          <DialogContent
            contentText={LINK_CONTENT_I18N_KEY(userUpdateTermList, linkClickHandle)}
            descText={_t('929ed7212de84800a14a')}
            agreeText={_t('3c55461596fa4800a032')}
            refuseText={_t('69e1b779418e4000a304')}
            onAgreeHandle={onAgreeInTerm}
            onLeaveHandle={onLeaveInTerm}
            onFinish={onClose}
          />
        ) : (
          <DialogContent
            titleText={_t('1394bc56eb714800a020')}
            contentText={LINK_LEAVE_CONTENT_I18N_KEY(userUpdateTermList, linkClickHandle)}
            descText={_t('8e40673aff114800a007')}
            agreeText={_t('02ab3b37d0024800ab26')}
            refuseText={_t('58a24e882a4e4000a088')}
            onAgreeHandle={onAgreeInRetain}
            onLeaveHandle={onLeaveInRetain}
          />
        )}
      </DialogContentWrapper>
    </DialogWrapper>
  );
};
