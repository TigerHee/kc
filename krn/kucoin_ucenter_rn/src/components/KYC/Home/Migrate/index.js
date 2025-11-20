import React, {useEffect, useState} from 'react';
import {Button, useTheme} from '@krn/ui';
import {openNative} from '@krn/bridge';
import useIconSrc from 'hooks/useIconSrc';
import {getNativeInfo} from 'utils/helper';
import {pullUserCanTransfer} from 'services/kyc';
import useLang from 'hooks/useLang';
import {MigrateWrapper, InfoIcon, MigrateContent, MigrateText} from './style';
import {getSiteName} from './util';

export default () => {
  const {_t} = useLang();
  const theme = useTheme();
  const warnIcon = useIconSrc('warn');

  const [canTransferInfo, setCanTransferInfo] = useState({});

  const targetSiteName = getSiteName(canTransferInfo?.targetSiteType);

  useEffect(() => {
    pullUserCanTransfer()
      .then(res => {
        setCanTransferInfo(res?.data || {});
      })
      .catch(err => {
        console.error('pullUserCanTransfer err === ', err);
      });
  }, []);

  const onPageToMigrate = async () => {
    const {webApiHost} = await getNativeInfo();
    const url = `https://${webApiHost}/account/transfer?appNeedLang=true`;
    openNative(`/link?url=${encodeURIComponent(url)}`);
  };

  return canTransferInfo?.canTransfer ? (
    <MigrateWrapper>
      <InfoIcon source={warnIcon} />

      <MigrateContent>
        <MigrateText>
          {_t('b23683a37b624800a45f', {targetSiteName})}
        </MigrateText>

        <Button
          onPress={onPageToMigrate}
          size="mini"
          styles={{
            buttonOuter: {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.colorV2.text,
              borderStyle: 'solid',
              borderRadius: 20,
              alignSelf: 'flex-start',
            },
            buttonText: {
              color: theme.colorV2.text,
            },
          }}
          type="secondary">
          {_t('e1c0ce05b3034800a59f')}
        </Button>
      </MigrateContent>
    </MigrateWrapper>
  ) : null;
};
