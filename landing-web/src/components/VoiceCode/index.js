/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import systemDynamic from 'utils/systemDynamic';

const VoiceCode = systemDynamic('@remote/entrance', 'VoiceCode');

const Index = props => {
  return <VoiceCode {...props} />;
};

export default Index;
