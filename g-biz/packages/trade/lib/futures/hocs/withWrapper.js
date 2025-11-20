/*
 * @owner: tank@kupotech.com
 */
import React from 'react';
import { EmotionCacheProvider } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';
export default (Component) => (props) => {
    const { i18n } = useTranslation();
    return (React.createElement(EmotionCacheProvider, { isRTL: isRTLLanguage(i18n.language) },
        React.createElement(Component, { ...props })));
};
