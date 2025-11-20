/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Button, css, Dialog, Global, Select, styled, useSnackbar } from '@kux/mui';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { _t } from 'src/tools/i18n';
import { COMPANY_INFO, EN_US, LANG_OPTIONS, LIST_STYLE, ZH_HK } from './constants';
import { Desc, Item, List, Title } from './styled';

const ExDialog = styled(Dialog)`
  .KuxModalFooter-root {
    padding-top: 20px;
    border-top: 0.5px solid ${({ theme }) => theme.colors.cover8};
  }
  .KuxDialog-body {
    max-height: 700px;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  .KuxSelect-root {
    width: 160px;
  }
`;
const Content = styled.div`
  margin-top: 16px;
  margin-bottom: 32px;
`;

const MaterialListDialog = ({ open, onClose, companyType }) => {
  const { isZh } = useLocale();
  const [lang, setLang] = useState(isZh ? ZH_HK : EN_US);
  const [loading, setLoading] = useState(false);
  const { message } = useSnackbar();

  const renderContent = (showTitle) => {
    const { title, desc, content = [] } = COMPANY_INFO[companyType]?.[lang] ?? {};
    const renderList = (list, listStyle) => (
      <List listStyle={listStyle} deepen={listStyle === LIST_STYLE.AUTO}>
        {list.map(({ text, children = [], listStyle }, index) => {
          return (
            <Item key={index}>
              {text}
              {children.length ? renderList(children, listStyle) : null}
            </Item>
          );
        })}
      </List>
    );
    return (
      <>
        {showTitle ? <Title>{title}</Title> : null}
        <Desc>{desc}</Desc>
        {renderList(content, LIST_STYLE.AUTO)}
      </>
    );
  };

  const handleDownload = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { url, title } = COMPANY_INFO[companyType][lang];
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const newUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = newUrl;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ExDialog
      open={open}
      size="large"
      title={_t('bb21e1cdd6b14800af0f')}
      onCancel={onClose}
      onOk={handleDownload}
      okButtonProps={{ loading }}
      okText={_t('eb7079d2af8a4800a625')}
    >
      <Header>
        <Select options={LANG_OPTIONS} value={lang} onChange={(value) => setLang(value)} />
        <Button type="brandGreen" variant="text" onClick={window.print}>
          {_t('a869f9a868514000ae1e')}
        </Button>
      </Header>
      <Content>
        <Global
          styles={css`
            #material_list_content {
              display: none;
            }
            @media print {
              body {
                overflow: auto !important;
              }
              body > * {
                display: none !important;
              }
              #material_list_content {
                display: block !important;
              }
            }
          `}
        />
        {renderContent(false)}
        {ReactDOM.createPortal(
          <div id="material_list_content">{renderContent(true)}</div>,
          document.body,
        )}
      </Content>
    </ExDialog>
  );
};

export default MaterialListDialog;
