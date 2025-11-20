/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import {
  Table,
  Tr,
  Th,
  ThCenter,
  Td,
  TdCenter,
  TdCenterBottom,
  TdBottom,
} from '../CopyTrading/index.style';

export default () => {
  return (
    <Table>
      <Tr>
        <Th> </Th>
        <ThCenter>{_t('7ber6iCpiDoY856UgjxXjs')}</ThCenter>
        <Th>{_t('98hKFZudY7idarYUXkajXf')}</Th>
      </Tr>
      <Tr>
        <Td>{_t('8nQ8TtpSUs7SZArcdMm1r3')}</Td>
        <TdCenter>{_t('gJkJsmHkUaWDNTheNVA2WE')} </TdCenter>
        <Td>{_t('gYg35NMSjEqSgbCAN7fGQc')}</Td>
      </Tr>
      <Tr>
        <Td>{_t('tYtwTTqGSk2LvDR9zpDkHf')}</Td>
        <TdCenter>{_t('5aUFJK36b2besULUxxQxtD')}</TdCenter>
        <Td>{_t('n3RBQtNfXkttSwVe4R7Dhn')}</Td>
      </Tr>
      <Tr>
        <Td>{_t('gpfM8xLYWhHTZXXpApHt4q')}</Td>
        <TdCenter>{_t('fZfGE1K8JdStt1jJn5XiJZ')} </TdCenter>
        <Td>{_t('2ngFTk3qSuSuXmEL1EF6sf')}</Td>
      </Tr>
      <Tr>
        <Td>{_t('3HyHdRhHbiAEekQ6K732cT')}</Td>
        <TdCenter>{_t('27u7AGWHZUQweQxG7LJLdK')}</TdCenter>
        <Td>{_t('uJsKk8jhS5mwMrAwZ2iZhW')}</Td>
      </Tr>
      <Tr>
        <Td>{_t('fo7zFZ2saP32Jg6UK3GHBV')}</Td>
        <TdCenter>{_t('wmiP4FrnNUa23ne8wC3nxc')}</TdCenter>
        <Td>{_t('gdk7yN16zVfyCHbRb4sUTh')}</Td>
      </Tr>
      <Tr>
        <TdBottom>{_t('o8m7LjHhFREwYxpELbvLUG')}</TdBottom>
        <TdCenterBottom>{_t('sXpxtTwSfPZYEBp4Dbto8G')}</TdCenterBottom>
        <TdBottom>{_t('fW2YErs1WarPGw8tr2XtGT')}</TdBottom>
      </Tr>
    </Table>
  );
};
