/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button, Dialog, styled } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { queryTransferAsset } from 'services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import closeIcon from 'static/account/transfer/close.svg';
import noteIcon from 'static/account/transfer/status-note.svg';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import { getValidAppTransferLink } from '../../utils/url';
import Card from './components/Card';
import Step6Table from './TransferTable/Step6Table';
import { getCurrentCardOrderNumber, getStatus, isDone } from './utils';

const curOrderIndex = 5;

/**
 * 处置资产
 */
export default function AssetCard({ progress, updateProgress }) {
  const [open, setOpen] = useState(false);
  const [assetsData, setAssetsData] = useState();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const errMessage = useMessageErr();
  const isApp = JsBridge.isApp();
  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);

  useEffect(() => {
    const status = getStatus(progress, curOrderIndex, assetsData);
    updateProgress(curOrderIndex, status);
  }, [progress[curOrderIndex - 1], progress[curOrderIndex], assetsData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const res = await queryTransferAsset({
            targetSiteType: userTransferInfo?.targetSiteType,
            originalSiteType: userTransferInfo?.originalSiteType,
          });
          if (res.success && res.data) setAssetsData(res.data);
        } catch (error) {
          console.error('request error:', error);
          errMessage(_t('68a1f352e1dd4000a867'));
        }
      });
      return () => {
        end?.(); // 清理轮询
      };
    }
  }, [userTransferInfo]);

  const orderText = getCurrentCardOrderNumber(curOrderIndex, progress);

  return (
    <Card
      title={_t('f69de5d4a0f34800a931')}
      subTitle={_t('7f057a3a7fa14000aca0', { targetSiteName })}
      note={_t('164a849554374000a1ef')}
      status={progress[curOrderIndex]}
      order={orderText}
      showContent={!!assetsData && !isDone(assetsData)}
      btnTxt={_t('f69de5d4a0f34800a931')}
      btn={
        progress[curOrderIndex] !== 3 ? (
          <Btn
            variant="text"
            disabled={progress[curOrderIndex] !== 1}
            onClick={() => {
              if (progress[curOrderIndex] !== 1) return;
              setOpen(true);
            }}
            status={progress[curOrderIndex]}
          >
            {_t('3848dfd87e514800a16e')}
            <ICArrowRight2Outlined size={12} />
          </Btn>
        ) : null
      }
      onConfirm={() => {
        setOpen(true);
      }}
    >
      <Step6Table data={assetsData} />
      <DialogStyled
        open={open}
        onOk={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        header={null}
        footer={null}
      >
        <DialogContent>
          <DialogHead>
            <DialogCloseIcon src={closeIcon} alt="note" onClick={() => setOpen(false)} />
          </DialogHead>
          <DialogNoteIcon src={noteIcon} alt="note" />
          {_t('df188ce316af4000a844')}
          <Button
            fullWidth
            style={{ margin: '32px 0' }}
            onClick={() => {
              setOpen(false);
              trackClick(['assetButton6', 'step6Button'], {
                user_target_siteType: userTransferInfo?.targetSiteType,
              });
              if (isApp) {
                const link = getValidAppTransferLink('/account/asset?from=overview');

                JsBridge.open({
                  type: 'jump',
                  params: {
                    url: link,
                  },
                });
              } else {
                window.open(addLangToPath('/assets'));
              }
            }}
          >
            {_t('3735af0e703a4000a795')}
          </Button>
        </DialogContent>
      </DialogStyled>
    </Card>
  );
}

const Btn = styled(Button)`
  display: inline-flex;
  padding: 5.5px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: ${({ theme, status }) => (status ? theme.colors.text : theme.colors.text30)};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  cursor: pointer;
`;

const DialogStyled = styled(Dialog)`
  .KuxDialog-content {
    padding: 0 24px;
  }
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
`;

const DialogHead = styled.div`
  padding: 32px 0 0 0;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const DialogNoteIcon = styled.img`
  width: 121px;
  height: 98px;
  margin-bottom: 21px;
`;

const DialogCloseIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
