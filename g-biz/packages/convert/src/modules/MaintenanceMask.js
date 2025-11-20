/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled, Box } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { fade } from '@kux/mui/utils/colorManipulator';
import maintenanceDark from '../../static/maintenance-dark.svg';
import maintenanceLight from '../../static/maintenance-light.svg';

const getImgSrc = (theme) => {
  const imgSrcMap = {
    dark: maintenanceDark,
    light: maintenanceLight,
  };
  return imgSrcMap[theme] || imgSrcMap.light;
};

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  background-color: ${(props) => fade(props.theme.colors.overlay, 0.8)};
`;
const Description = styled.div`
  font-size: 13px;
  font-weight: 400;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text40};
`;

const MaintenanceMask = () => {
  const { t: _t } = useTranslation('convert');
  return (
    <Container>
      <Box textAlign="center">
        <img width={140} height={140} src={getImgSrc()} alt="maintenance" />
        <Description>{_t('cmfHzuvVq7YLFNHz3cmb5P')}</Description>
      </Box>
    </Container>
  );
};

export default MaintenanceMask;
