/**
 * Owner: sean.shi@kupotech.com
 */
import { Button } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import storage from '@utils/storage';
import DialogFailInfo from '../../../static/dialog-fail-info.svg';
import DialogFailInfoDark from '../../../static/dialog-fail-info-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';
import siteConfig from '../../common/siteConfig';
import { addLangToPath } from '../../common/tools';
import {
  DialogWrapper,
  DialogContentWrapper,
  ImgWrap,
  TipTitle,
  ContentWrap,
  ContentItem,
  Operate,
} from './styled';

export const ClearUserDialog = ({ onClose, visible }) => {
  const { getThemeImg } = useThemeImg();
  const { t: _t } = useTranslation('entrance');

  const handleClose = () => {
    onClose?.();
    // 跳转到资产申领站登陆页面
    window.location = addLangToPath(
      `${siteConfig?.CL_SITE_HOST}/ucenter/signin`,
      storage.getItem('kucoinv2_lang'),
    );
  };

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
      <DialogContentWrapper>
        <ImgWrap>
          <img
            alt="dialog fail tip"
            src={getThemeImg({ light: DialogFailInfo, dark: DialogFailInfoDark })}
          />
        </ImgWrap>
        <TipTitle>{_t('80f8e92599e34000a551')}</TipTitle>
        <ContentWrap>
          <ContentItem>{_t('95b46490fd224000a72a')}</ContentItem>
          <ContentItem>{_t('89a9001fafe54000a18f')}</ContentItem>
        </ContentWrap>
        <Operate>
          <Button onClick={handleClose}>{_t('c9af292c5e484000ab09')}</Button>
        </Operate>
      </DialogContentWrapper>
    </DialogWrapper>
  );
};
