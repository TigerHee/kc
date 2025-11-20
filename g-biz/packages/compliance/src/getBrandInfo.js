/**
 * Owner: eli.xiang@kupotech.com
 * 该文件已经废弃，没用了
 */
import remoteEvent from '@tools/remoteEvent';
import { brandDbStore, brandStoreKey } from '@tools/brandStorage';
import { lookupPath } from '@tools/i18n';

const AdminConfigCode = 'brandInfoConfig';

export default function getBrandInfo() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          const brandConfig = res?.data?.properties?.[0]?.backupValues;
          if (brandConfig) {
            brandDbStore.set(brandStoreKey, brandConfig);
            remoteEvent.emit(remoteEvent.evts.GET_BRAND_INFO, brandConfig);
          }
        } catch (e) {
          console.log('get brand info error:', e);
        }
      }
    }
  };
  const language = lookupPath();
  xhr.open(
    'GET',
    `/_api/growth-config/get/client/config/codes?businessLine=ucenter&codes=${AdminConfigCode}&lang=${language}`,
  );
  xhr.send();
}

getBrandInfo();
