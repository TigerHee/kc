/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-05 01:34:17
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 01:53:37
 */
import styled from '@emotion/styled';
import { _t } from 'src/tools/i18n';

const Text = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 400;
  position: relative;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  ::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    content: attr(data-content);
    -webkit-text-stroke: 1.5px #000;
  }
`;

const BlueText = styled(Text)`
  color: #97a0ff;
`;

const Wrap = styled.section`
  z-index: 9;
  position: relative;
`;

export const MiddleTip = ({ className }) => {
  return (
    <Wrap className={className}>
      <Text data-content={_t('0ce51ad14e794000a48b')}>{_t('0ce51ad14e794000a48b')}</Text>
      <BlueText data-content={_t('de9cd7eee45a4000ab48')}>{_t('de9cd7eee45a4000ab48')}</BlueText>
    </Wrap>
  );
};
