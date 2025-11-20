/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { MIcons } from 'Bot/components/Common/Icon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from '@emotion/styled';
import { Text } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';
import { useSnackbar } from '@kux/mui/hooks';

const Border = styled(Text)`
  transition: all 0.3s linear;
  border: 1px solid transparent;
  cursor: pointer;
  padding: 4px 20px;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.divider4};
    border-radius: 20px;
  }
`;

export default ({ id, className }) => {
  const { message } = useSnackbar();
  const onCopy = useCallback(() => {
    message.success(_t('copysuc'));
  }, [message]);
  return (
    <div className={`flex hc mt-22 ${className}`}>
      <CopyToClipboard text={id} onCopy={onCopy}>
        <Border color="text60" className="Flex vc fs-12">
          <span className="pr-6">
            {_t('71UWPXRfJd5Bs41umLp8gY')}: {id}
          </span>
          <MIcons.Copy color="icon" size={12} />
        </Border>
      </CopyToClipboard>
    </div>
  );
};
