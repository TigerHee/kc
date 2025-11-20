import React from 'react';
import FixedItem from '../FixedItem';
import {ReactComponent as VoiceCloseSvg} from '@/static/voice/voice_close.svg';
import {ReactComponent as VoiceOpenSvg} from '@/static/voice/voice_open.svg';
import { useGlobalStore } from '@/store/global';


const Voice = () => {
  const { voiceOpen, setVoiceOpen } = useGlobalStore();
  return (
    <FixedItem
      onClick={() => {
        setVoiceOpen(!voiceOpen);
      }}
    >
      {voiceOpen ? <VoiceOpenSvg /> : <VoiceCloseSvg />}
    </FixedItem>
  );
};

export default Voice;
